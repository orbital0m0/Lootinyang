# Design: 미구현 기능 상세 설계

## 1. 개요

| 항목 | 내용 |
|------|------|
| Feature | 미구현 기능 일괄 구현 |
| Plan 참조 | `docs/01-plan/features/unimplemented-features.plan.md` |
| 작성일 | 2026-02-12 |
| 기술 스택 | React 19 + TypeScript + TanStack Query + Supabase + Framer Motion |

## 2. 아키텍처 설계

### 2.1 게임 이벤트 흐름 (핵심 루프)

```
[사용자 습관 체크]
       │
       ▼
  useDailyChecks.checkHabit()
       │
       ├─── 경험치 부여 ──► useUser.addExp(10)
       │                         │
       │                         └─► 레벨업 체크 → Toast 알림
       │
       ├─── 스트릭 업데이트 ──► useGameEvents.updateStreak()
       │                             │
       │                             └─► 스트릭 기반 업적 체크
       │
       ├─── 주간 목표 체크 ──► 목표 달성 시 보상 상자 생성
       │                         │
       │                         └─► useRewards.createRewardBox()
       │
       └─── 업적 조건 체크 ──► useAchievementChecker.checkAll()
                                    │
                                    └─► 달성 시 Toast + DB 저장
```

### 2.2 새로운 훅/모듈 의존성

```
src/hooks/
├── useGameEvents.ts        ← 중앙 이벤트 관리 (NEW)
│   ├── uses: useUser
│   ├── uses: useRewards (확장)
│   ├── uses: useAchievementChecker
│   └── uses: useToast
├── useAchievementChecker.ts ← 업적 자동 검사 (NEW)
│   ├── uses: useAchievements (기존)
│   └── uses: useUser
├── useItems.ts              ← 사용자 아이템 관리 (NEW)
│   └── uses: supabaseHelpers
├── useToast.ts              ← 토스트 알림 상태 (NEW)
└── useDailyChecks.ts        ← 체크 시 useGameEvents 호출 (MODIFY)

src/utils/
└── rewardLogic.ts           ← 아이템 확률/보상 로직 (NEW)

src/components/
└── Toast.tsx                ← 토스트 UI (NEW)
```

## 3. Phase A: 게이미피케이션 핵심 로직 상세 설계

### 3.1 useGameEvents.ts (신규 - 중앙 이벤트 관리자)

게임 이벤트를 중앙에서 관리하여 습관 체크 → 경험치/보상/업적을 연쇄 처리합니다.

```typescript
// src/hooks/useGameEvents.ts

interface GameEvent {
  type: 'habit_checked' | 'habit_unchecked' | 'weekly_target_reached' | 'level_up';
  payload: Record<string, unknown>;
}

interface UseGameEventsReturn {
  processHabitCheck: (habitId: string, userId: string) => Promise<void>;
  processWeeklyTarget: (userId: string) => Promise<void>;
  streak: number;
  isProcessing: boolean;
}

export function useGameEvents(): UseGameEventsReturn;
```

**processHabitCheck 로직**:
1. `useUser.addExp(APP_CONFIG.DAILY_REWARD_EXP)` → +10 EXP
2. 스트릭 보너스 계산: `UTILS.calculateStreakBonus(10, streak)` → 스트릭 7일 이상이면 ×1.5
3. `checkAllAchievements()` 호출하여 업적 조건 검사
4. `showToast()` 로 결과 알림

**processWeeklyTarget 로직**:
1. 주간 목표 달성 여부 확인
2. 달성 시 `useRewards.createRewardBox('weekly')` 호출
3. `useUser.addExp(APP_CONFIG.WEEKLY_REWARD_EXP)` → +50 EXP
4. 3주 연속 달성 체크 → special 상자 생성

### 3.2 useDailyChecks.ts 수정

기존 `checkHabitMutation`의 `onSuccess`에 게임 이벤트 트리거를 추가합니다.

```typescript
// 수정할 부분: checkHabitMutation.onSuccess
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['dailyChecks', userId] });
  queryClient.invalidateQueries({ queryKey: ['weeklyProgress'] });
  queryClient.invalidateQueries({ queryKey: ['userStats'] });

  // NEW: 게임 이벤트 처리
  // processHabitCheck()는 컴포넌트 레벨에서 호출
  // (훅 내부에서 다른 훅을 mutation callback에서 직접 호출할 수 없으므로)
},
```

**설계 결정**: useDailyChecks 내부에서 직접 게임 로직을 호출하지 않고, 컴포넌트 레벨에서 `checkHabit` 성공 후 `gameEvents.processHabitCheck()`를 호출하는 패턴을 사용합니다. 이렇게 하면 훅 간 순환 의존성을 방지합니다.

```typescript
// Home.tsx에서의 사용 예시
const gameEvents = useGameEvents();

const handleToggleCheck = async (habitId: string) => {
  const today = new Date().toISOString().split('T')[0];
  if (isTodayChecked(habitId)) {
    await uncheckHabit(habitId, today);
  } else {
    await checkHabit(habitId, today);
    // 체크 성공 시 게임 이벤트 처리
    await gameEvents.processHabitCheck(habitId, user!.id);
  }
};
```

### 3.3 스트릭 계산 로직

useGameEvents 내부에서 스트릭을 관리합니다. 별도 훅 대신 통합하여 복잡도를 낮춥니다.

```typescript
// useGameEvents.ts 내부
async function calculateAndUpdateStreak(userId: string): Promise<number> {
  // 1. 사용자의 모든 활성 습관 조회
  // 2. 오늘 날짜의 모든 습관 체크 여부 확인
  // 3. 모든 습관 체크 완료 → streak + 1
  // 4. 하나라도 미완료 → streak 유지 (다음날 자정에 리셋)
  // 5. DB 업데이트: useUser.updateStreak(newStreak)
}
```

**스트릭 규칙**:
- 오늘 모든 활성 습관 체크 완료 시 streak +1
- 어제 체크하지 않은 습관이 있으면 streak = 0 (보호 아이템 사용 중이면 유지)
- 스트릭 계산 시점: 습관 체크 시마다 실시간 갱신

### 3.4 useRewards.ts 확장

기존 조회 전용 훅에 mutation을 추가합니다.

```typescript
// 추가할 메서드들

// 보상 상자 생성
createRewardBox: (type: RewardBox['type']) => Promise<RewardBox>;

// 상자 열기 (랜덤 아이템 생성 포함)
openRewardBox: (boxId: string) => Promise<{ box: RewardBox; items: Item[] }>;

// 상태
isCreating: boolean;
isOpening: boolean;
```

**createRewardBox 구현**:
```typescript
const createRewardBoxMutation = useMutation({
  mutationFn: async (type: RewardBox['type']) => {
    if (!userId) throw new Error('사용자 ID가 필요합니다.');
    return supabaseHelpers.createRewardBox({
      user_id: userId,
      type,
      is_opened: false,
      items: [],
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['rewardBoxes', userId] });
  },
});
```

**openRewardBox 구현**:
```typescript
const openRewardBoxMutation = useMutation({
  mutationFn: async (boxId: string) => {
    // 1. rewardLogic.generateItems()로 아이템 생성
    // 2. supabaseHelpers.openRewardBox(boxId, items) 호출
    // 3. 생성된 아이템을 user_items에 추가
    // 4. 결과 반환
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['rewardBoxes', userId] });
    queryClient.invalidateQueries({ queryKey: ['userItems', userId] });
  },
});
```

### 3.5 rewardLogic.ts (신규 - 아이템 확률 테이블)

```typescript
// src/utils/rewardLogic.ts

// 상자 타입별 아이템 확률 테이블
const RARITY_PROBABILITIES: Record<RewardBox['type'], Record<Item['rarity'], number>> = {
  daily:   { common: 0.70, rare: 0.25, epic: 0.04, legendary: 0.01 },
  weekly:  { common: 0.40, rare: 0.40, epic: 0.15, legendary: 0.05 },
  monthly: { common: 0.20, rare: 0.35, epic: 0.30, legendary: 0.15 },
  special: { common: 0.05, rare: 0.30, epic: 0.45, legendary: 0.20 },
};

// 아이템 개수 설정
const ITEMS_PER_BOX: Record<RewardBox['type'], number> = {
  daily: 1,
  weekly: 2,
  monthly: 3,
  special: 3,
};

export function generateItems(boxType: RewardBox['type']): Item[];
export function selectRarity(boxType: RewardBox['type']): Item['rarity'];
export function selectItemByRarity(rarity: Item['rarity']): Item;
```

**generateItems 알고리즘**:
1. `ITEMS_PER_BOX[boxType]` 만큼 반복
2. 각 반복마다 `selectRarity(boxType)` 으로 랜덤 등급 결정
3. `selectItemByRarity(rarity)` 로 해당 등급의 랜덤 아이템 선택
4. 중복 제거 (같은 아이템이 나오면 재선택)
5. `Item[]` 반환

### 3.6 useItems.ts (신규 - 사용자 아이템 관리)

```typescript
// src/hooks/useItems.ts

interface UserItem {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  is_used: boolean;
  acquired_at: string;
  item?: Item; // join된 아이템 정보
}

interface UseItemsReturn {
  items: UserItem[];
  loading: boolean;
  error: string | null;
  addItem: (itemId: string, quantity?: number) => Promise<void>;
  useItem: (userItemId: string) => Promise<void>;
  getItemCount: (itemId: string) => number;
  hasProtectionShield: () => boolean;
  refetch: () => void;
}

export function useItems(userId?: string): UseItemsReturn;
```

**supabaseHelpers 확장 필요**:
```typescript
// src/services/supabase.ts에 추가

async getUserItems(userId: string) {
  const { data, error } = await supabase
    .from('user_items')
    .select('*, items(*)')
    .eq('user_id', userId)
    .order('acquired_at', { ascending: false });
  if (error) throw error;
  return data;
},

async addUserItem(userId: string, itemId: string, quantity: number = 1) {
  // upsert: 이미 같은 아이템이 있으면 quantity 증가
  const { data: existing } = await supabase
    .from('user_items')
    .select('*')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('user_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('user_items')
      .insert({ user_id: userId, item_id: itemId, quantity, is_used: false })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
},

async useUserItem(userItemId: string) {
  const { data: item } = await supabase
    .from('user_items')
    .select('*')
    .eq('id', userItemId)
    .single();

  if (!item || item.quantity <= 0) throw new Error('아이템이 없습니다.');

  const newQuantity = item.quantity - 1;
  if (newQuantity <= 0) {
    await supabase.from('user_items').delete().eq('id', userItemId);
  } else {
    await supabase
      .from('user_items')
      .update({ quantity: newQuantity })
      .eq('id', userItemId);
  }
},
```

## 4. Phase B: 업적 시스템 자동화 상세 설계

### 4.1 useAchievementChecker.ts (신규)

```typescript
// src/hooks/useAchievementChecker.ts

interface AchievementCheckContext {
  userId: string;
  totalHabits: number;
  streak: number;
  level: number;
  totalBoxesOpened: number;
  weeklyTargetStreak: number; // 연속 주간 목표 달성 횟수
}

interface UseAchievementCheckerReturn {
  checkAll: (context: AchievementCheckContext) => Promise<string[]>; // 달성된 업적 ID 목록 반환
  isChecking: boolean;
}

export function useAchievementChecker(): UseAchievementCheckerReturn;
```

**업적 조건 매핑 (constants.ts의 ACHIEVEMENTS_DATA 기반)**:

| condition 값 | 검사 로직 | 필요 데이터 |
|-------------|----------|------------|
| `create_first_habit` | `totalHabits >= 1` | habits count |
| `streak_7_days` | `streak >= 7` | user.streak |
| `streak_30_days` | `streak >= 30` | user.streak |
| `three_weeks_success` | `weeklyTargetStreak >= 3` | 주간 달성 연속 카운트 |
| `create_5_habits` | `totalHabits >= 5` | habits count |
| `open_10_boxes` | `totalBoxesOpened >= 10` | opened reward boxes count |
| `reach_level_50` | `level >= 50` | user.level |
| `perfect_month` | 별도 함수로 계산 | 해당월 모든 일일 체크 데이터 |

**checkAll 구현 흐름**:
```
1. DB에서 사용자 미달성 업적 목록 조회
2. 각 업적의 condition을 context와 대조
3. 조건 충족 시 unlockAchievement() 호출
4. 달성된 업적 ID 배열 반환
5. 호출자(useGameEvents)가 Toast로 알림
```

### 4.2 Achievements.tsx 수정

하드코딩 데이터를 실데이터로 교체합니다.

```typescript
// 현재 (하드코딩):
const sampleAchievements: Achievement[] = [{ id: '1', name: '첫걸음', ... }];
const unlockedAchievements = new Set(['1', '4']);

// 변경 후 (실데이터):
const { allAchievements, userAchievements, loading, error,
        getStatsByCategory, isAchievementUnlocked, getTotalPoints
      } = useAchievements(user?.id);
```

**주요 변경점**:
- `sampleAchievements` → `allAchievements` (DB에서 조회)
- `unlockedAchievements` Set → `isAchievementUnlocked(id)` 함수 사용
- 필터링 로직 → `getAchievementsByCategory()` 사용
- 총 포인트 → `getTotalPoints()` 사용
- 통계 → `getStatsByCategory()` 사용

## 5. Phase C: 페이지 실데이터 연동 상세 설계

### 5.1 Rewards.tsx 수정

```typescript
// 현재 (하드코딩):
const sampleItems: Item[] = [{ id: '1', name: '고양이 장난감', ... }];
const sampleRewardBoxes: RewardBox[] = [{ id: 'box-1', ... }];

// 변경 후:
const { user } = useUser();
const { rewardBoxes, availableBoxes, loading: rewardsLoading } = useRewards(user?.id);
const { items, loading: itemsLoading } = useItems(user?.id);
const gameEvents = useGameEvents();

const handleOpenBox = async (boxId: string) => {
  const result = await gameEvents.openRewardBox(boxId);
  // result.items를 모달로 표시
};
```

**변경 범위**:
- 보상 상자 탭: `sampleRewardBoxes` → `rewardBoxes`
- 아이템 탭: 하드코딩 배열 → `items` (useItems에서 조회)
- 상자 개수 표시: 하드코딩 "3" → `availableBoxes.length`
- 아이템 사용 버튼: `useItems.useItem()` 호출
- RewardBoxComponent의 `onOpen`: 실제 DB 업데이트 + 아이템 생성

### 5.2 CatRoom.tsx 수정

```typescript
// 현재 (하드코딩):
const CAT_ITEMS: Item[] = [{ id: 'scarf1', ... }];
const [items, setItems] = useState<Item[]>(CAT_ITEMS);

// 변경 후:
const { items, loading } = useItems(user?.id);

// 장착 상태는 별도 로컬 스토리지 또는 DB 저장
// (user_items에 equipped 컬럼 추가 또는 users 테이블에 equipped_items JSONB 추가)
```

**설계 결정 - 장착 상태 저장 방식**:
- **방안 1**: `users` 테이블에 `equipped_items: JSONB` 컬럼 추가 (권장)
  - 장점: 추가 테이블 불필요, 간단한 구현
  - 형식: `{ hat: 'item_id', necklace: 'item_id', ... }`
- **방안 2**: `user_items`에 `equipped: boolean` 컬럼 추가
  - 장점: 정규화된 구조
  - 단점: 카테고리별 1개만 장착하는 로직이 복잡

→ **방안 1 채택**: `users.equipped_items` JSONB 사용

### 5.3 Home.tsx 수정

```typescript
// 현재 (하드코딩):
const [daysUntilReward] = useState(2);

// 변경 후:
const { availableBoxes } = useRewards(user?.id);

// "보상까지 N일" 계산 로직
function getDaysUntilReward(habits: Habit[], dailyChecks: DailyCheck[]): number {
  // 이번 주 남은 체크 수 / 하루 평균 체크 가능 수
  const totalRemaining = habits.reduce((sum, habit) => {
    const checked = getCheckedDatesThisWeek(habit.id).length;
    const remaining = Math.max(0, (habit.weekly_target || 5) - checked);
    return sum + remaining;
  }, 0);
  return Math.ceil(totalRemaining / habits.length) || 0;
}
```

**추가 변경점**:
- 미열린 보상 상자 개수 배지 표시
- 오늘 경험치 획득량 표시
- 스트릭 정보 표시

## 6. Phase D: 알림 및 피드백 시스템 상세 설계

### 6.1 Toast 시스템

```typescript
// src/hooks/useToast.ts

interface Toast {
  id: string;
  type: 'success' | 'achievement' | 'levelup' | 'reward' | 'info';
  title: string;
  message?: string;
  icon?: string;
  duration?: number; // ms, 기본 3000
}

interface UseToastReturn {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

// Context 기반으로 앱 전체에서 접근 가능
export const ToastContext = createContext<UseToastReturn | null>(null);
export function ToastProvider({ children }: { children: ReactNode }): JSX.Element;
export function useToast(): UseToastReturn;
```

```typescript
// src/components/Toast.tsx

// 화면 상단에 고정되는 토스트 알림 UI
// - 레벨업: 금색 배경 + 레벨업 아이콘 + 파티클 효과
// - 업적 달성: 보라색 배경 + 업적 뱃지 + 축하 애니메이션
// - 보상 획득: 파란색 배경 + 상자 아이콘
// - 일반 성공: 녹색 배경 + 체크 아이콘

// Framer Motion AnimatePresence로 슬라이드 인/아웃
// 자동 dismiss (duration ms 후)
// 수동 dismiss (스와이프 또는 닫기 버튼)
```

**Toast 타입별 디자인**:

| type | 배경색 | 아이콘 | 효과 |
|------|--------|--------|------|
| success | `bg-green-500` | `✅` | slideDown |
| achievement | `bg-purple-500` | 업적 아이콘 | slideDown + sparkle |
| levelup | `bg-amber-500` | `🎊` | slideDown + bounce |
| reward | `bg-blue-500` | `🎁` | slideDown |
| info | `bg-gray-700` | `ℹ️` | slideDown |

### 6.2 ToastProvider 배치

```typescript
// App.tsx 수정
function App() {
  return (
    <ErrorBoundary type="app">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>  {/* NEW */}
          <div className="min-h-screen bg-gray-50">
            <RouterProvider router={router} />
          </div>
          <ToastContainer />  {/* NEW */}
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

### 6.3 CatCharacter 상호작용 확장

기존 CatCharacter 컴포넌트에 이벤트 기반 반응을 추가합니다.

```typescript
// CatCharacter.tsx 확장 props
interface CatCharacterProps {
  mood?: CatMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onMoodChange?: (mood: CatMood) => void;
  // NEW
  triggerReaction?: 'check_complete' | 'level_up' | 'reward' | 'streak' | null;
}
```

**반응 애니메이션**:
- `check_complete`: mood → 'happy', 하트 이모지 3개 팝업 후 사라짐
- `level_up`: mood → 'excited', 별 파티클 효과 + 크기 1.3배 확대 후 복귀
- `reward`: mood → 'excited', 선물 이모지 팝업
- `streak`: mood → 'happy', 불꽃 이모지 + 숫자 표시

## 7. 구현 순서

```
1단계: 유틸리티 & 서비스 (의존성 없는 기반)
├── src/utils/rewardLogic.ts           ← 아이템 확률 로직
└── src/services/supabase.ts           ← getUserItems, addUserItem, useUserItem 추가

2단계: 토스트 시스템 (다른 기능들이 사용)
├── src/hooks/useToast.ts              ← Toast Context
└── src/components/Toast.tsx           ← Toast UI
└── src/App.tsx                        ← ToastProvider 래핑

3단계: 아이템 훅 (보상 시스템 전제)
└── src/hooks/useItems.ts              ← user_items 관리

4단계: 보상 훅 확장 (상자 생성/오픈)
└── src/hooks/useRewards.ts            ← createRewardBox, openRewardBox 추가

5단계: 업적 체커 (게임 이벤트에서 사용)
└── src/hooks/useAchievementChecker.ts ← 업적 자동 달성

6단계: 게임 이벤트 (전체 연결)
└── src/hooks/useGameEvents.ts         ← 경험치, 스트릭, 보상, 업적 통합

7단계: 페이지 실데이터 연동
├── src/pages/Home.tsx                 ← 대시보드 실데이터
├── src/pages/Rewards.tsx              ← 보상 페이지 실데이터
├── src/pages/Achievements.tsx         ← 업적 페이지 실데이터
└── src/pages/CatRoom.tsx              ← 고양이방 실데이터

8단계: 캐릭터 상호작용
└── src/components/CatCharacter.tsx    ← 이벤트 기반 반응 추가

9단계: hooks/index.ts 업데이트
└── src/hooks/index.ts                 ← 새 훅들 export 추가
```

## 8. 데이터 모델 변경사항

### 8.1 users 테이블 확장 (필요 시)

```sql
-- 장착 아이템 저장용 (CatRoom 연동)
ALTER TABLE users ADD COLUMN IF NOT EXISTS equipped_items JSONB DEFAULT '{}';
```

### 8.2 types/index.ts 확장

```typescript
// 추가할 타입들

export interface UserItem {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  is_used: boolean;
  acquired_at: string;
  item?: Item;
}

export interface UseItemsReturn {
  items: UserItem[];
  loading: boolean;
  error: string | null;
  addItem: (itemId: string, quantity?: number) => Promise<void>;
  useItem: (userItemId: string) => Promise<void>;
  getItemCount: (itemId: string) => number;
  hasProtectionShield: () => boolean;
  refetch: () => void;
}

export interface Toast {
  id: string;
  type: 'success' | 'achievement' | 'levelup' | 'reward' | 'info';
  title: string;
  message?: string;
  icon?: string;
  duration?: number;
}

export interface UseGameEventsReturn {
  processHabitCheck: (habitId: string, userId: string) => Promise<void>;
  processWeeklyTarget: (userId: string) => Promise<void>;
  streak: number;
  isProcessing: boolean;
}
```

## 9. 에러 처리 전략

| 시나리오 | 처리 방식 |
|---------|----------|
| 경험치 추가 실패 | 로컬 큐에 저장, 다음 체크 시 재시도. 사용자에게는 성공 표시 |
| 보상 상자 생성 실패 | Toast로 에러 알림. 습관 체크는 유지 |
| 업적 달성 저장 실패 | console.error + 다음 체크 시 재검사 |
| 아이템 추가 실패 | 상자 오픈 상태는 롤백하지 않음 (중복 방지), Toast로 에러 알림 |
| Supabase 연결 실패 | 기존 ErrorBoundary 활용, 오프라인 상태 표시 |

## 10. 테스트 계획

| 테스트 항목 | 방법 | 우선순위 |
|------------|------|---------|
| rewardLogic 확률 분포 | 단위 테스트 (1000회 실행 후 분포 확인) | High |
| 경험치 계산 정확성 | 단위 테스트 | High |
| 스트릭 계산 엣지 케이스 | 단위 테스트 (자정 넘김, 보호 아이템 등) | High |
| 업적 조건 매칭 | 단위 테스트 (각 조건별) | Medium |
| 상자 오픈 → 아이템 생성 플로우 | 통합 테스트 | Medium |
| 습관 체크 → 게임 이벤트 체인 | 통합 테스트 | Medium |
| Toast 표시/자동 dismiss | 컴포넌트 테스트 | Low |
