# Design: 로그인 제거 & 로컬 저장 모드

## 1. 개요

| 항목 | 내용 |
|------|------|
| Feature | local-storage-mode |
| Plan 참조 | `docs/01-plan/features/local-storage-mode.plan.md` |
| 작성일 | 2026-02-22 |
| 아키텍처 레벨 | Dynamic |

---

## 2. 아키텍처 개요

### 변경 전 (Supabase 기반)
```
Browser
  └── React App
        ├── hooks (useUser, useHabits, ...) → supabase.ts → Supabase Cloud DB
        ├── Auth (Login/Signup) → Supabase Auth
        └── TanStack Query (캐시 레이어)
```

### 변경 후 (localStorage 기반)
```
Browser
  └── React App
        ├── hooks (useUser, useHabits, ...) → localStore.ts → localStorage
        ├── Onboarding (닉네임 설정, 경고 고지)
        ├── TanStack Query (캐시 레이어, staleTime: Infinity)
        └── BackupModal (내보내기/가져오기)
```

---

## 3. localStorage 키 설계

| 키 | 타입 | 내용 |
|----|------|------|
| `lootinyang_user` | `LocalUser` | 사용자 프로필 전체 |
| `lootinyang_habits` | `Habit[]` | 습관 목록 |
| `lootinyang_daily_checks` | `DailyCheck[]` | 일일 체크 전체 이력 |
| `lootinyang_user_achievements` | `string[]` | 달성된 achievement id 배열 |
| `lootinyang_user_items` | `LocalUserItem[]` | 보유 아이템 배열 |
| `lootinyang_reward_boxes` | `RewardBox[]` | 보상 상자 배열 |
| `lootinyang_onboarded` | `boolean` | 온보딩 완료 여부 |
| `lootinyang_warned` | `boolean` | 데이터 손실 경고 확인 여부 |

---

## 4. 신규 파일 상세 설계

### 4.1 `src/services/localStore.ts`

localStorage CRUD 추상화 레이어. 모든 훅은 이 서비스를 통해 데이터에 접근한다.

```typescript
// 로컬 저장소 키 상수
export const STORE_KEYS = {
  USER: 'lootinyang_user',
  HABITS: 'lootinyang_habits',
  DAILY_CHECKS: 'lootinyang_daily_checks',
  USER_ACHIEVEMENTS: 'lootinyang_user_achievements',
  USER_ITEMS: 'lootinyang_user_items',
  REWARD_BOXES: 'lootinyang_reward_boxes',
  ONBOARDED: 'lootinyang_onboarded',
  WARNED: 'lootinyang_warned',
} as const;

// 타입 안전 getter
export function getStore<T>(key: string, defaultValue: T): T;

// 타입 안전 setter
export function setStore<T>(key: string, value: T): void;

// 키 삭제
export function removeStore(key: string): void;

// 전체 앱 데이터 내보내기 (백업용)
export function exportAllData(): AppBackupData;

// 전체 앱 데이터 가져오기 (복원용)
export function importAllData(data: AppBackupData): void;

// 특정 키 마이그레이션 (버전 업그레이드 대비)
export function migrateStore(fromVersion: string, toVersion: string): void;

// LocalUser 타입 (Supabase User와 auth_id 필드만 다름)
export interface LocalUser {
  id: string;            // crypto.randomUUID() 생성
  username: string;
  level: number;
  exp: number;
  streak: number;
  total_habits: number;
  created_at: string;
  updated_at: string;
}

// 백업 데이터 타입
export interface AppBackupData {
  version: '1.0';
  exportedAt: string;   // ISO8601
  data: {
    user: LocalUser | null;
    habits: Habit[];
    daily_checks: DailyCheck[];
    user_achievements: string[];
    user_items: LocalUserItem[];
    reward_boxes: RewardBox[];
  };
}
```

**초기화 로직:**
- `getStore` 호출 시 키가 없으면 `defaultValue` 반환
- `setStore` 호출 시 JSON.stringify 후 저장
- localStorage 쓰기 실패(용량 초과 등) 시 console.error 후 조용히 실패

---

### 4.2 `src/hooks/useBackup.ts`

백업 코드 생성 및 복원 로직.

```typescript
export interface UseBackupReturn {
  exportBackupCode: () => string;          // "LOOT-<base64>" 형식 코드 생성
  importBackupCode: (code: string) => void; // 코드 파싱 후 전체 복원
  downloadBackupFile: () => void;           // .json 파일 다운로드
  isValidCode: (code: string) => boolean;   // 코드 유효성 검사
}

export function useBackup(): UseBackupReturn;
```

**백업 코드 형식:**
```
"LOOT-" + btoa(JSON.stringify(AppBackupData))
```

**복원 플로우:**
1. `code.startsWith('LOOT-')` 검증
2. `atob(code.slice(5))` → JSON.parse
3. `data.version === '1.0'` 검증
4. `importAllData(data)` → localStorage 전체 덮어쓰기
5. TanStack Query `queryClient.invalidateQueries()` 전체 실행
6. 페이지 새로고침 또는 navigate('/')

---

### 4.3 `src/components/BackupModal.tsx`

```typescript
interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupModal({ isOpen, onClose }: BackupModalProps): JSX.Element;
```

**UI 구성 (2탭):**

**내보내기 탭:**
```
┌────────────────────────────────────────┐
│ 내 데이터 백업                          │
├────────────────────────────────────────┤
│ 백업 코드를 안전한 곳에 보관하세요.      │
│ ┌──────────────────────────────────┐   │
│ │ LOOT-eyJ2ZXJzaW9uIjoiMS4wI...  │   │
│ └──────────────────────────────────┘   │
│ [코드 복사]  [파일 다운로드]            │
└────────────────────────────────────────┘
```

**가져오기 탭:**
```
┌────────────────────────────────────────┐
│ 백업 코드로 복원                        │
├────────────────────────────────────────┤
│ ⚠️ 현재 데이터가 모두 교체됩니다.       │
│ ┌──────────────────────────────────┐   │
│ │ LOOT- 로 시작하는 코드 입력...   │   │
│ └──────────────────────────────────┘   │
│ [복원하기]                             │
└────────────────────────────────────────┘
```

---

### 4.4 `src/components/DataWarningBanner.tsx`

```typescript
export function DataWarningBanner(): JSX.Element | null;
```

**표시 조건:** `getStore(STORE_KEYS.WARNED, false) === false`

**UI:**
```
┌─────────────────────────────────────────────────────┐
│ 💾 이 앱은 데이터를 이 브라우저에 저장합니다.         │
│    브라우저 캐시를 삭제하면 데이터가 사라져요.         │
│    백업 코드로 데이터를 안전하게 보관하세요.           │
│                              [백업하기] [확인했어요] │
└─────────────────────────────────────────────────────┘
```

- "확인했어요" 클릭 → `setStore(STORE_KEYS.WARNED, true)` → 배너 숨김
- "백업하기" 클릭 → BackupModal 오픈

---

### 4.5 `src/pages/Onboarding.tsx`

기존 `Auth.tsx` 대체. 최초 방문자에게 표시.

```typescript
export function Onboarding(): JSX.Element;
```

**표시 조건:** `getStore(STORE_KEYS.ONBOARDED, false) === false`

**UI 플로우:**
```
1단계: 환영 화면 (고양이 애니메이션 + 앱 설명)
2단계: 닉네임 설정 (선택, 건너뛰기 가능)
3단계: 데이터 저장 방식 안내 (경고 고지)
      - "데이터는 이 기기에만 저장됩니다"
      - "백업 코드로 다른 기기에 옮길 수 있습니다"
      - "기존 백업 코드가 있다면 지금 복원하세요" [복원하기]
[시작하기] → setStore(ONBOARDED, true) → navigate('/')
```

---

## 5. 훅 재설계 상세

### 5.1 `useUser.ts` 재설계

**변경:** Supabase auth → localStore, userId는 localStorage에서 읽음

```typescript
// queryFn 변경
queryFn: () => {
  const stored = getStore<LocalUser | null>(STORE_KEYS.USER, null);
  if (stored) return stored;

  // 최초 방문: LocalUser 자동 생성
  const newUser: LocalUser = {
    id: crypto.randomUUID(),
    username: 'User',
    level: 1, exp: 0, streak: 0, total_habits: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  setStore(STORE_KEYS.USER, newUser);
  return newUser;
}

// mutation 변경
mutationFn: async (updates: Partial<LocalUser>) => {
  const current = getStore<LocalUser>(STORE_KEYS.USER, defaultUser);
  const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
  setStore(STORE_KEYS.USER, updated);
  return updated;
}
```

**staleTime:** `Infinity` (localStorage는 서버 동기화 불필요)

---

### 5.2 `useHabits.ts` 재설계

```typescript
// queryFn
queryFn: () => {
  return getStore<Habit[]>(STORE_KEYS.HABITS, [])
    .filter(h => h.is_active);  // 소프트 딜리트 필터
}

// createHabit mutation
mutationFn: async (habitData) => {
  const habits = getStore<Habit[]>(STORE_KEYS.HABITS, []);
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    user_id: userId,
    ...habitData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  setStore(STORE_KEYS.HABITS, [...habits, newHabit]);
  return newHabit;
}

// deleteHabit mutation (소프트 딜리트 유지)
mutationFn: async (id: string) => {
  const habits = getStore<Habit[]>(STORE_KEYS.HABITS, []);
  setStore(STORE_KEYS.HABITS, habits.map(h =>
    h.id === id ? { ...h, is_active: false } : h
  ));
}
```

---

### 5.3 `useDailyChecks.ts` 재설계

```typescript
// DailyCheck 타입 (변경 없음)
interface DailyCheck {
  id: string;
  habit_id: string;
  date: string; // 'YYYY-MM-DD'
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// queryFn
queryFn: () => {
  return getStore<DailyCheck[]>(STORE_KEYS.DAILY_CHECKS, []);
}

// checkHabit mutation
mutationFn: async ({ habitId, date }) => {
  const checks = getStore<DailyCheck[]>(STORE_KEYS.DAILY_CHECKS, []);
  const existing = checks.find(c => c.habit_id === habitId && c.date === date);
  if (existing) {
    // 업데이트
    setStore(STORE_KEYS.DAILY_CHECKS, checks.map(c =>
      c.id === existing.id ? { ...c, completed: true, updated_at: now } : c
    ));
    return { ...existing, completed: true };
  } else {
    // 신규 생성
    const newCheck: DailyCheck = {
      id: crypto.randomUUID(),
      habit_id: habitId,
      date,
      completed: true,
      created_at: now,
      updated_at: now,
    };
    setStore(STORE_KEYS.DAILY_CHECKS, [...checks, newCheck]);
    return newCheck;
  }
}

// 90일 초과 체크 자동 정리 (용량 관리)
function pruneOldChecks(checks: DailyCheck[]): DailyCheck[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  return checks.filter(c => new Date(c.date) >= cutoff);
}
```

---

### 5.4 `useAchievements.ts` 재설계

`achievements` 테이블 데이터는 `ACHIEVEMENTS_DATA` 상수로 대체. 달성 여부만 localStorage에 저장.

```typescript
// queryFn (achievements 목록: 정적 데이터)
queryFn: () => ACHIEVEMENTS_DATA;  // constants.ts에서 직접

// queryFn (user_achievements: localStorage)
queryFn: () => {
  const unlockedIds = getStore<string[]>(STORE_KEYS.USER_ACHIEVEMENTS, []);
  return unlockedIds;
}

// unlockAchievement mutation
mutationFn: async (achievementId: string) => {
  const unlocked = getStore<string[]>(STORE_KEYS.USER_ACHIEVEMENTS, []);
  if (!unlocked.includes(achievementId)) {
    setStore(STORE_KEYS.USER_ACHIEVEMENTS, [...unlocked, achievementId]);
  }
}
```

---

### 5.5 `useItems.ts` 재설계

```typescript
// LocalUserItem (Supabase UserItem에서 user_id 제거, item: Item 참조는 ITEMS_DATA에서)
interface LocalUserItem {
  id: string;
  item_id: string;
  quantity: number;
  is_used: boolean;
  acquired_at: string;
}

// queryFn
queryFn: () => {
  const items = getStore<LocalUserItem[]>(STORE_KEYS.USER_ITEMS, []);
  // ITEMS_DATA와 join
  return items.map(ui => ({
    ...ui,
    item: ITEMS_DATA.find(i => i.id === ui.item_id),
  }));
}

// addItem mutation (upsert: quantity 증가 또는 신규 추가)
mutationFn: async (itemId: string, quantity = 1) => {
  const items = getStore<LocalUserItem[]>(STORE_KEYS.USER_ITEMS, []);
  const existing = items.find(i => i.item_id === itemId);
  if (existing) {
    setStore(STORE_KEYS.USER_ITEMS, items.map(i =>
      i.item_id === itemId ? { ...i, quantity: i.quantity + quantity } : i
    ));
  } else {
    setStore(STORE_KEYS.USER_ITEMS, [...items, {
      id: crypto.randomUUID(),
      item_id: itemId,
      quantity,
      is_used: false,
      acquired_at: new Date().toISOString(),
    }]);
  }
}

// useItem mutation (quantity 감소, 0이면 삭제)
mutationFn: async (userItemId: string) => {
  const items = getStore<LocalUserItem[]>(STORE_KEYS.USER_ITEMS, []);
  const updated = items.map(i =>
    i.id === userItemId ? { ...i, quantity: i.quantity - 1 } : i
  ).filter(i => i.quantity > 0);
  setStore(STORE_KEYS.USER_ITEMS, updated);
}
```

---

### 5.6 `useRewards.ts` 재설계

```typescript
// queryFn
queryFn: () => {
  return getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []);
}

// createRewardBox mutation
mutationFn: async (type: RewardBox['type']) => {
  const boxes = getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []);
  const newBox: RewardBox = {
    id: crypto.randomUUID(),
    user_id: userId,
    type,
    is_opened: false,
    items: [],
    created_at: new Date().toISOString(),
    opened_at: null,
  };
  setStore(STORE_KEYS.REWARD_BOXES, [...boxes, newBox]);
  return newBox;
}

// openRewardBox mutation (기존 rewardLogic.ts generateItems 재사용)
mutationFn: async (boxId: string) => {
  const boxes = getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []);
  const box = boxes.find(b => b.id === boxId);
  if (!box || box.is_opened) throw new Error('열 수 없는 상자입니다.');

  const generatedItems = generateItems(box.type);  // 기존 rewardLogic.ts 재사용
  const now = new Date().toISOString();

  setStore(STORE_KEYS.REWARD_BOXES, boxes.map(b =>
    b.id === boxId ? { ...b, is_opened: true, items: generatedItems.map(i => i.id), opened_at: now } : b
  ));

  // 아이템 추가 (useItems의 addItem 로직 직접 호출 또는 별도 처리)
  generatedItems.forEach(item => addItemToStore(item.id));

  return { box: { ...box, is_opened: true }, items: generatedItems };
}
```

---

## 6. 라우팅 설계 변경

### 6.1 `src/App.tsx` 변경

```typescript
// 제거
import { AuthPage } from './pages/Auth';
import { ResetPassword } from './pages/ResetPassword';

// 추가
import { Onboarding } from './pages/Onboarding';
import { DataWarningBanner } from './components/DataWarningBanner';

// 라우터 변경
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <PageTransition><Home /></PageTransition> },
      // ... 기존 라우트 유지
    ],
  },
  {
    path: '/onboarding',
    element: <PageTransition><Onboarding /></PageTransition>,
  },
  // /auth, /reset-password 라우트 제거
]);

// App 컴포넌트에 DataWarningBanner 추가
function App() {
  return (
    <ErrorBoundary type="app">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <DataWarningBanner />
            <RouterProvider router={router} />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

### 6.2 페이지별 auth 가드 제거

**변경 전 (Home.tsx 등):**
```typescript
useEffect(() => {
  if (!user) navigate('/auth');
}, [user, navigate]);
```

**변경 후 (온보딩 가드로 교체):**
```typescript
useEffect(() => {
  const onboarded = getStore(STORE_KEYS.ONBOARDED, false);
  if (!onboarded) navigate('/onboarding');
}, [navigate]);
```

단, `useUser()`는 항상 LocalUser를 반환(null 없음)하므로 대부분의 경우 가드 자체가 불필요.

---

## 7. useUser 인터페이스 변경

```typescript
// User 타입 변경 (types/index.ts)
// 기존: auth_id, email 필드 포함
// 변경: auth_id, email 필드 제거 (LocalUser 타입 사용)

export interface LocalUser {
  id: string;
  username: string;
  level: number;
  exp: number;
  streak: number;
  total_habits: number;
  created_at: string;
  updated_at: string;
}

// useUser 반환 타입 변경
// user: User | null → user: LocalUser  (항상 non-null)
```

---

## 8. 제거 대상 파일

| 파일 | 이유 |
|------|------|
| `src/pages/Auth.tsx` | Onboarding으로 대체 |
| `src/pages/ResetPassword.tsx` | 비밀번호 기능 제거 |
| `src/components/auth/ForgotPasswordModal.tsx` | 비밀번호 기능 제거 |
| `src/components/auth/` 디렉토리 | 인증 컴포넌트 전체 |
| `src/services/supabase.ts` | localStore.ts로 대체 |
| `src/pages/DatabaseTest.tsx` | DB 테스트 페이지 (불필요) |

---

## 9. 패키지 변경

```bash
# 제거
npm uninstall @supabase/supabase-js

# 추가 없음 (crypto.randomUUID는 브라우저 내장)
```

**번들 사이즈 감소 효과:**
- `@supabase/supabase-js`: 168.68 kB (gzip 43.97 kB) 제거

---

## 10. 타입 변경 (`src/types/index.ts`)

```typescript
// 제거
// - User의 auth_id, email 필드

// 추가
export interface LocalUser {
  id: string;
  username: string;
  level: number;
  exp: number;
  streak: number;
  total_habits: number;
  created_at: string;
  updated_at: string;
}

export interface LocalUserItem {
  id: string;
  item_id: string;
  quantity: number;
  is_used: boolean;
  acquired_at: string;
}

export interface AppBackupData {
  version: '1.0';
  exportedAt: string;
  data: {
    user: LocalUser | null;
    habits: Habit[];
    daily_checks: DailyCheck[];
    user_achievements: string[];
    user_items: LocalUserItem[];
    reward_boxes: RewardBox[];
  };
}
```

---

## 11. 구현 순서 (Do Phase 가이드)

```
Step 1: src/services/localStore.ts 생성
Step 2: src/types/index.ts 수정 (LocalUser, LocalUserItem, AppBackupData 추가)
Step 3: src/hooks/useUser.ts 재작성 (localStore 기반)
Step 4: src/hooks/useHabits.ts 재작성
Step 5: src/hooks/useDailyChecks.ts 재작성
Step 6: src/hooks/useAchievements.ts 재작성
Step 7: src/hooks/useItems.ts 재작성
Step 8: src/hooks/useRewards.ts 재작성
Step 9: src/hooks/useGameEvents.ts 수정 (userId 참조 방식 변경)
Step 10: src/hooks/useBackup.ts 생성
Step 11: src/components/BackupModal.tsx 생성
Step 12: src/components/DataWarningBanner.tsx 생성
Step 13: src/pages/Onboarding.tsx 생성
Step 14: src/App.tsx 수정 (라우팅, DataWarningBanner 추가)
Step 15: 각 페이지 auth 가드 제거 (Home, Habits, Rewards, Profile, Achievements, CatRoom)
Step 16: src/pages/Profile.tsx 백업 버튼 추가
Step 17: 제거 대상 파일 삭제
Step 18: package.json에서 @supabase/supabase-js 제거
Step 19: .env 정리
Step 20: tsc --noEmit, vite build 검증
```

---

## 12. 엣지 케이스 처리

| 케이스 | 처리 방법 |
|--------|-----------|
| localStorage 비활성화 (시크릿 브라우저) | try/catch 후 메모리 폴백 (Map 사용) |
| localStorage 용량 초과 | 90일 초과 daily_checks 자동 정리 후 재시도 |
| 잘못된 백업 코드 입력 | try/catch + 에러 토스트 표시 |
| 백업 코드 버전 불일치 | version 필드 체크 후 마이그레이션 or 에러 |
| 복원 중 실패 | 복원 전 현재 데이터 임시 백업 후 복원 실패 시 롤백 |
