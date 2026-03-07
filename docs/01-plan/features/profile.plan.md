# Plan: 프로필 페이지 실데이터 연동 & 설정 기능 구현

## 1. 개요

| 항목 | 내용 |
|------|------|
| Feature | profile |
| 작성일 | 2026-03-07 |
| 우선순위 | Medium |
| 예상 범위 | StatisticsTab 실데이터 연동, SettingsTab 기능 구현, 개발용 코드 제거 |

### 배경 및 목적

프로필 페이지 UI는 구현되어 있으나, 대부분의 데이터가 하드코딩된 더미 상태이다.
실제 사용자 데이터(습관, 체크, 업적)를 표시하고, 설정 기능(알림, 테마)이 동작하도록 완성한다.

---

## 2. 현재 구현 상태 분석

### 완료된 항목 (정상 동작)

| 파일 | 상태 | 비고 |
|------|------|------|
| `Profile.tsx` | ✅ 완료 | 탭 구조, BackupModal 연동 정상 |
| `ProfileHeader.tsx` | ✅ 완료 | user.username, user.streak 실데이터 사용 |
| `LevelCard.tsx` | ⚠️ 부분 | 레벨/EXP 실데이터, 단 개발용 버튼 노출 |

### 미구현 항목 (하드코딩)

#### StatisticsTab.tsx

| 항목 | 현재 | 교체 방향 |
|------|------|-----------|
| 전체 체크 수 | `42` 하드코딩 | `useDailyChecks` → 전체 체크 배열 길이 |
| 달성률 | `'85%'` 하드코딩 | 최근 30일 체크 수 / (습관 수 × 30) |
| 업적 수 | `12` 하드코딩 | `useAchievements` → 달성 업적 수 |
| 최근 업적 3개 | 더미 배열 | `useAchievements` → 달성된 업적 최신 3개 |
| 주간 습관 통계 | 더미 배열 | `useHabits` + `useDailyChecks` → 이번 주 각 습관 달성 현황 |

#### SettingsTab.tsx

| 항목 | 현재 | 교체 방향 |
|------|------|-----------|
| 알림 토글 | UI만 있음, 동작 안 함 | `lootinyang_settings` localStorage 키로 저장/불러오기 |
| 테마 선택 | UI만 있음, 동작 안 함 | `lootinyang_settings` localStorage 저장 + CSS 클래스 적용 |

#### LevelCard.tsx

| 항목 | 현재 | 처리 방향 |
|------|------|-----------|
| "레벨업 테스트" 버튼 | 개발용 디버그 버튼 | 제거 |

---

## 3. 구현 계획

### Phase A: StatisticsTab 실데이터 연동

#### A-1. 통계 수치 계산

`StatisticsTab` 내에서 훅을 직접 호출하여 실데이터로 교체한다.

```
useAchievements() → unlockedAchievements.length → 업적 수
useDailyChecks()  → dailyChecks.length          → 전체 체크 수
useDailyChecks()  → 최근 30일 필터              → 달성률 계산
useHabits()       → habits.length               → 달성률 분모
```

달성률 계산:
```
최근 30일 체크 수 / (활성 습관 수 × 30) × 100
```

#### A-2. 최근 업적 연동

```
useAchievements() → unlockedAchievements → 최신 3개 슬라이스
ACHIEVEMENTS_DATA → id로 icon, name 조회
```

#### A-3. 주간 습관 통계 연동

이번 주 월~일 날짜 범위를 계산하여 각 습관의 체크 현황을 표시한다.

```
useHabits()       → 활성 습관 목록
useDailyChecks()  → 이번 주 체크 필터링
각 습관별 이번 주 목표(frequency) vs 실제 체크 수 계산
```

> 주간 목표(target): `habit.frequency` 필드 사용 (없으면 7로 기본값)

### Phase B: SettingsTab 기능 구현

#### B-1. Settings localStorage 키 추가

`src/services/localStore.ts`의 `STORE_KEYS`에 추가:
```
lootinyang_settings: AppSettings
```

`AppSettings` 타입:
```typescript
interface AppSettings {
  notifications: {
    habitReminder: boolean;   // 습관 리마인더
    rewardAlert: boolean;     // 보상 알림
  };
  theme: 'default' | 'mint' | 'lavender' | 'rose';
}
```

기본값:
```typescript
const DEFAULT_SETTINGS: AppSettings = {
  notifications: { habitReminder: true, rewardAlert: false },
  theme: 'default',
};
```

#### B-2. useSettings 훅 생성

`src/hooks/useSettings.ts` 신규 생성:
- `settings` 상태 반환
- `updateNotification(key, value)` mutation
- `updateTheme(theme)` mutation
- TanStack Query 기반, `staleTime: Infinity`

#### B-3. SettingsTab 실기능 연동

- `useSettings()` 훅 호출
- 알림 토글: `updateNotification` 호출
- 테마 선택: `updateTheme` 호출 + `document.documentElement`에 `data-theme` 속성 적용

#### B-4. 테마 CSS 적용

`src/App.tsx` 또는 `src/main.tsx`에서 앱 초기화 시 저장된 테마를 `data-theme` 속성으로 적용.
`tailwind.config.js`에 테마별 CSS 변수 오버라이드 추가.

> **참고**: 테마 변경이 복잡하면 B-4는 별도 피처로 분리 가능.

### Phase C: 개발용 코드 제거 & 타입 정리

#### C-1. LevelCard 디버그 버튼 제거

- `LevelCard.tsx`에서 "레벨업 테스트" 버튼 제거
- `onLevelUpTest` prop 제거
- `Profile.tsx`에서 `handleLevelUp`, `showLevelUp` 관련 코드 제거

#### C-2. ProfileHeader 타입 정리

- `user: User | null` → `user: LocalUser` (useUser는 항상 non-null 반환)
- `|| 7`, `|| '냥냥이'` 폴백 제거 (DEFAULT_USER에서 처리됨)

---

## 4. 구현 우선순위 및 의존성

```
Phase A (StatisticsTab 실데이터) ← 최우선, 사용자에게 가장 가치 있음
  A-1 통계 수치 계산
  A-2 최근 업적 연동 ← A-1과 함께
  A-3 주간 습관 통계 ← A-1과 함께

Phase B (SettingsTab 기능) ← Phase A 완료 후
  B-1 AppSettings 타입 + localStore 키
  B-2 useSettings 훅 ← B-1에 의존
  B-3 SettingsTab 연동 ← B-2에 의존
  B-4 테마 CSS 적용 ← B-3에 의존 (선택적)

Phase C (정리) ← 언제든 가능, 독립적
  C-1 LevelCard 디버그 버튼 제거
  C-2 ProfileHeader 타입 정리
```

---

## 5. 수정이 필요한 기존 파일

| 파일 | 수정 내용 |
|------|-----------|
| `src/components/profile/StatisticsTab.tsx` | 훅 연동으로 더미 데이터 교체 |
| `src/components/profile/SettingsTab.tsx` | useSettings 훅 연동 |
| `src/components/profile/LevelCard.tsx` | 디버그 버튼 제거 |
| `src/components/profile/ProfileHeader.tsx` | 타입 정리 |
| `src/pages/Profile.tsx` | showLevelUp 관련 코드 정리 |
| `src/services/localStore.ts` | STORE_KEYS.SETTINGS 추가 |

---

## 6. 신규 파일

| 파일 | 용도 |
|------|------|
| `src/hooks/useSettings.ts` | 앱 설정 상태 관리 훅 |

---

## 7. 리스크 및 대안

| 리스크 | 영향 | 대안 |
|--------|------|------|
| habit.frequency 필드 없음 | 주간 목표 계산 불가 | 7을 기본값으로 사용 |
| 테마 CSS 구조 복잡 | 구현 난이도 상승 | B-4 생략, 테마 선택만 저장 후 나중에 적용 |
| 달성률 계산 엣지케이스 | 습관 0개일 때 0% | 습관 없으면 "-" 표시 |
