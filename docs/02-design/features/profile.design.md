# Design: 프로필 페이지 실데이터 연동 & 설정 기능 구현

## 1. 개요

| 항목 | 내용 |
|------|------|
| Feature | profile |
| 작성일 | 2026-03-07 |
| Plan 참조 | `docs/01-plan/features/profile.plan.md` |

---

## 2. 아키텍처 구조

```
src/
├── services/
│   └── localStore.ts          [수정] STORE_KEYS.SETTINGS 추가, AppSettings 타입 추가
├── hooks/
│   └── useSettings.ts         [신규] 앱 설정 상태 관리
├── components/profile/
│   ├── StatisticsTab.tsx      [수정] 훅 연동, 더미 데이터 제거
│   ├── SettingsTab.tsx        [수정] useSettings 연동
│   ├── LevelCard.tsx          [수정] 디버그 버튼 제거
│   └── ProfileHeader.tsx      [수정] 타입 정리
└── pages/
    └── Profile.tsx            [수정] showLevelUp 코드 정리
```

---

## 3. 데이터 구조 설계

### 3.1 AppSettings 타입

```typescript
// src/services/localStore.ts 에 추가
export interface AppSettings {
  notifications: {
    habitReminder: boolean;  // 습관 리마인더 (기본: true)
    rewardAlert: boolean;    // 보상 알림 (기본: false)
  };
  theme: 'default' | 'mint' | 'lavender' | 'rose';  // 기본: 'default'
}

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: { habitReminder: true, rewardAlert: false },
  theme: 'default',
};
```

### 3.2 STORE_KEYS 추가

```typescript
export const STORE_KEYS = {
  // 기존 키들 유지...
  SETTINGS: 'lootinyang_settings',  // 추가
} as const;
```

---

## 4. 신규 파일: useSettings.ts

```typescript
// src/hooks/useSettings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS, DEFAULT_SETTINGS, AppSettings } from '../services/localStore';

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ['settings'],
    queryFn: (): AppSettings => getStore<AppSettings>(STORE_KEYS.SETTINGS, DEFAULT_SETTINGS),
    staleTime: Infinity,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<AppSettings>): Promise<AppSettings> => {
      const current = getStore<AppSettings>(STORE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      const next = { ...current, ...updates };
      setStore(STORE_KEYS.SETTINGS, next);
      return next;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const updateNotification = (key: keyof AppSettings['notifications'], value: boolean) => {
    const current = getStore<AppSettings>(STORE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    updateSettingsMutation.mutate({
      notifications: { ...current.notifications, [key]: value },
    });
  };

  const updateTheme = (theme: AppSettings['theme']) => {
    updateSettingsMutation.mutate({ theme });
    // data-theme 속성으로 즉시 적용
    document.documentElement.setAttribute('data-theme', theme);
  };

  return { settings, updateNotification, updateTheme };
}
```

---

## 5. 컴포넌트 변경 설계

### 5.1 StatisticsTab.tsx 전체 재작성

**훅 사용:**
```typescript
const { user } = useUser();
const { habits } = useHabits(user.id);
const { dailyChecks, getWeeklyProgress } = useDailyChecks(user.id);
const { allAchievements, getUnlockedAchievements } = useAchievements(user.id);
```

**통계 수치 계산 로직:**

| 항목 | 계산 방법 |
|------|-----------|
| 연속 일수 | `user.streak` (기존 유지) |
| 전체 체크 | `dailyChecks.filter(c => c.completed).length` |
| 달성률 | 최근 30일 체크 / (habits.length × 30) × 100, habits 없으면 `'-'` |
| 업적 수 | `getUnlockedAchievements().length` |

```typescript
// 달성률 계산
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const cutoff = thirtyDaysAgo.toISOString().split('T')[0];

const recentChecks = dailyChecks.filter(c => c.completed && c.date >= cutoff).length;
const maxPossible = habits.length * 30;
const completionRate = maxPossible > 0
  ? `${Math.round((recentChecks / maxPossible) * 100)}%`
  : '-';
```

**최근 업적 (3개):**
```typescript
// getUnlockedAchievements()는 이미 unlocked_at 내림차순 정렬됨
const recentAchievements = getUnlockedAchievements()
  .slice(0, 3)
  .map(ua => ({
    icon: ua.achievement.icon,
    name: ua.achievement.name,
  }));
```

> 달성 업적이 없을 경우: "아직 달성한 업적이 없어요" 빈 상태 메시지 표시

**주간 습관 통계:**
```typescript
// useDailyChecks의 getWeeklyProgress(habitId, weeklyTarget) 재사용
const weeklyStats = habits.map(habit => {
  const progress = getWeeklyProgress(habit.id, habit.weekly_target);
  // 이번 주 달성 횟수 = progress * weekly_target / 100 (정수 근사)
  const completed = Math.round((progress / 100) * habit.weekly_target);
  return {
    name: habit.name,
    progress,
    completed,
    target: habit.weekly_target,
  };
});
```

> 습관이 없을 경우: "등록된 습관이 없어요" 빈 상태 메시지 표시
> 습관이 5개 초과 시: 상위 5개만 표시

### 5.2 SettingsTab.tsx 수정

**훅 사용:**
```typescript
const { settings, updateNotification, updateTheme } = useSettings();
```

**알림 설정 데이터:**
```typescript
const notifications = [
  {
    key: 'habitReminder' as const,
    name: '습관 리마인더',
    description: '매일 9시 알림',
    enabled: settings.notifications.habitReminder,
  },
  {
    key: 'rewardAlert' as const,
    name: '보상 알림',
    description: '상자 획득 시 알림',
    enabled: settings.notifications.rewardAlert,
  },
];
```

**토글 버튼 onClick:**
```typescript
onClick={() => updateNotification(item.key, !item.enabled)}
```

**테마 설정 데이터:**
```typescript
const themes: { name: string; color: string; value: AppSettings['theme'] }[] = [
  { name: '기본', color: 'bg-cozy-orange', value: 'default' },
  { name: '민트', color: 'bg-cozy-sage', value: 'mint' },
  { name: '라벤더', color: 'bg-cozy-lavender', value: 'lavender' },
  { name: '로즈', color: 'bg-cozy-rose', value: 'rose' },
];
// active = settings.theme === theme.value
```

**테마 버튼 onClick:**
```typescript
onClick={() => updateTheme(theme.value)}
```

### 5.3 LevelCard.tsx 수정

제거 대상:
- `onLevelUpTest` prop 및 관련 button 엘리먼트

```typescript
// 변경 전
interface LevelCardProps {
  level: number; exp: number; expToNext: number;
  showLevelUp: boolean; onLevelUpTest: () => void;
}

// 변경 후
interface LevelCardProps {
  level: number; exp: number; expToNext: number; showLevelUp: boolean;
}
```

### 5.4 ProfileHeader.tsx 타입 정리

```typescript
// 변경 전
interface ProfileHeaderProps {
  user: User | null;
  showLevelUp: boolean;
}
// user?.level || 5, user?.streak || 7 등 폴백 코드

// 변경 후
interface ProfileHeaderProps {
  user: LocalUser;
  showLevelUp: boolean;
}
// user.level, user.streak 직접 사용 (useUser는 항상 non-null)
```

### 5.5 Profile.tsx 정리

제거 대상:
- `showLevelUp` state
- `handleLevelUp` 함수
- `LevelCard`의 `onLevelUpTest` prop

---

## 6. 구현 순서

```
1. localStore.ts     - STORE_KEYS.SETTINGS, AppSettings, DEFAULT_SETTINGS 추가
2. useSettings.ts    - 신규 생성
3. StatisticsTab.tsx - 훅 연동으로 완전 재작성
4. SettingsTab.tsx   - useSettings 연동
5. LevelCard.tsx     - 디버그 버튼 제거
6. ProfileHeader.tsx - 타입 정리
7. Profile.tsx       - showLevelUp 코드 정리
```

---

## 7. 빈 상태(Empty State) 처리

| 상황 | 표시 |
|------|------|
| 업적 없음 | "아직 달성한 업적이 없어요 🐱" |
| 습관 없음 | "습관을 추가하면 통계가 보여요 📊" |
| 달성률 분모 0 | `'-'` 텍스트 |

---

## 8. 테마 적용 범위

v1에서는 `data-theme` 속성 저장만 구현한다. CSS 변수 오버라이드는 추후 별도 피처에서 처리한다.
테마 선택 시 `document.documentElement.setAttribute('data-theme', theme)` 호출로 향후 CSS 적용 준비.

---

## 9. 수정 파일 요약

| 파일 | 변경 유형 | 주요 변경 내용 |
|------|-----------|----------------|
| `src/services/localStore.ts` | 수정 | STORE_KEYS.SETTINGS, AppSettings, DEFAULT_SETTINGS 추가 |
| `src/hooks/useSettings.ts` | 신규 | 설정 상태 관리 훅 |
| `src/components/profile/StatisticsTab.tsx` | 수정 | 전체 훅 연동, 더미 제거 |
| `src/components/profile/SettingsTab.tsx` | 수정 | useSettings 연동 |
| `src/components/profile/LevelCard.tsx` | 수정 | 디버그 버튼 제거 |
| `src/components/profile/ProfileHeader.tsx` | 수정 | 타입 LocalUser로 교체 |
| `src/pages/Profile.tsx` | 수정 | showLevelUp state/handler 제거 |
