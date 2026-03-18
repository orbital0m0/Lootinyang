// ─── 보상 시스템 v2 기반 타입 ────────────────────────────────────────────────

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ItemCategory = 'theme' | 'font' | 'sticker' | 'textColor' | 'checkAnimation' | 'progressBar';

// 보상 아이템 (테마, 폰트, 스티커 등 해금 가능한 커스터마이징 요소)
export interface RewardItem {
  id: string;
  name: string;         // 영문 ID형 이름
  nameKo: string;       // 한국어 표시명
  category: ItemCategory;
  rarity: Rarity;
  previewData: Record<string, string>; // 카테고리별 프리뷰 (테마: CSS vars, 폰트: 샘플 텍스트 등)
  seasonId?: string;    // 시즌 한정 아이템의 시즌 ID
}

// 하위 호환성을 위한 Item 타입 별칭
export type Item = RewardItem;

// 사용자 인벤토리 (소유 + 장착 상태)
export interface UserInventory {
  ownedItems: string[];  // RewardItem.id 목록
  equipped: {
    theme: string;
    font: string;
    textColor: string;
    checkAnimation: string;
    progressBar: string;
    stickers: Record<string, string>; // habitId → stickerId
  };
  boxes: {
    normal: number;
    premium: number;
    event: number;
  };
}

export const DEFAULT_INVENTORY: UserInventory = {
  ownedItems: [],
  equipped: {
    theme: 'warm-white',
    font: 'pretendard',
    textColor: 'default',
    checkAnimation: 'simple-check',
    progressBar: 'solid-bar',
    stickers: {},
  },
  boxes: { normal: 0, premium: 0, event: 0 },
};

// 상자 오픈 결과
export interface BoxOpenResult {
  boxType: 'normal' | 'premium' | 'event';
  rarity: Rarity;
  item: RewardItem;
  isDuplicate: boolean;
  bonusXp?: number; // 중복 아이템 시 XP 전환
}

// 주간 진행률 기록
export interface WeeklyProgress {
  weekStart: string;    // ISO date (YYYY-MM-DD)
  completedDays: number;
  totalDays: number;
  boxEarned: boolean;   // 이번 주 상자 수령 여부
}

// ─── 로컬 사용자 ──────────────────────────────────────────────────────────────

export interface LocalUser {
  id: string;
  username: string;
  level: number;
  exp: number;
  streak: number;
  total_habits: number;
  weekly_streak?: number;
  created_at: string;
  updated_at: string;
}

// 하위 호환성을 위한 User 타입 별칭
export type User = LocalUser;

// ─── 습관 & 체크 ──────────────────────────────────────────────────────────────

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  weekly_target: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface DailyCheck {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// ─── 보상 상자 ────────────────────────────────────────────────────────────────

export interface RewardBox {
  id: string;
  user_id: string;
  type: 'normal' | 'premium' | 'event';
  is_opened: boolean;
  items: RewardItem[];  // 열었을 때 획득한 아이템
  created_at: string;
  opened_at?: string;
}

// ─── 업적 ─────────────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  points: number;
  badge_color: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

// ─── 사용자 아이템 (인벤토리 raw 데이터) ──────────────────────────────────────

export interface LocalUserItem {
  id: string;
  item_id: string;
  quantity: number;
  is_used: boolean;
  acquired_at: string;
  item?: RewardItem;
}

// 하위 호환성을 위한 별칭
export type UserItem = LocalUserItem;

// ─── 백업 ─────────────────────────────────────────────────────────────────────

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

// ─── 훅 반환 타입 ─────────────────────────────────────────────────────────────

export interface UseHabitsReturn {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  createHabit: (habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateHabit: (id: string, habit: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  refetch: () => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export interface UseDailyChecksReturn {
  dailyChecks: DailyCheck[];
  loading: boolean;
  error: string | null;
  checkHabit: (habitId: string, date: string) => Promise<void>;
  uncheckHabit: (habitId: string, date: string) => Promise<void>;
  getWeeklyProgress: (habitId: string, weeklyTarget: number) => number;
  isTodayChecked: (habitId: string) => boolean;
  isDateChecked: (habitId: string, date: string) => boolean;
  getCheckedDatesThisWeek: (habitId: string) => string[];
  refetch: () => void;
  isChecking: boolean;
  isUnchecking: boolean;
}

export interface UseUserReturn {
  user: LocalUser;
  loading: boolean;
  error: string | null;
  updateUser: (updates: Partial<LocalUser>) => Promise<void>;
  addExp: (exp: number) => Promise<void>;
  updateStreak: (streak: number) => Promise<void>;
  getExpToNextLevel: () => number;
  canLevelUp: () => boolean;
  isUpdating: boolean;
  isAddingExp: boolean;
  isUpdatingStreak: boolean;
}

export interface UseRewardsReturn {
  rewardBoxes: RewardBox[];
  availableBoxes: RewardBox[];
  openedBoxes: RewardBox[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createRewardBox: (type: RewardBox['type']) => Promise<RewardBox>;
  openRewardBox: (boxId: string) => Promise<{ box: RewardBox; items: RewardItem[] }>;
  getBoxesByType: (type: RewardBox['type']) => RewardBox[];
  getAvailableCount: (type: RewardBox['type']) => number;
  getBoxAnimationClass: (boxType: RewardBox['type']) => string;
  getBoxIcon: (boxType: RewardBox['type']) => string;
  getBoxColorTheme: (boxType: RewardBox['type']) => string;
  isCreating: boolean;
  isOpening: boolean;
}

export interface UseAchievementsReturn {
  allAchievements: Achievement[];
  userAchievements: UserAchievement[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  unlockAchievement: (achievementId: string) => Promise<boolean>;
  getAchievementsByCategory: () => {
    challenge: Achievement[];
    consistency: Achievement[];
    reward: Achievement[];
    legendary: Achievement[];
  };
  getProgressByAchievement: (achievementId: string) => number;
  getStatsByCategory: () => {
    overall: { total: number; unlocked: number; percentage: number };
    categories: {
      category: string;
      total: number;
      unlocked: number;
      percentage: number;
    }[];
  };
  isAchievementUnlocked: (achievementId: string) => boolean;
  getTotalPoints: () => number;
  getLockedAchievements: () => Achievement[];
  getUnlockedAchievements: () => (UserAchievement & { achievement: Achievement })[];
}

// ─── 토스트 ───────────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  type: 'success' | 'achievement' | 'levelup' | 'reward' | 'info';
  title: string;
  message?: string;
  icon?: string;
  duration?: number;
}

// ─── 게임 통계 ────────────────────────────────────────────────────────────────

export interface GameStats {
  level: number;
  currentExp: number;
  expToNextLevel: number;
  totalExp: number;
  streak: number;
  completedHabits: number;
  totalRewards: number;
}

export interface CatCharacter {
  mood: 'happy' | 'normal' | 'sleepy' | 'excited';
  level: number;
  accessories: string[];
}

// ─── 폼 ───────────────────────────────────────────────────────────────────────

export interface HabitFormData {
  name: string;
  weekly_target: number;
}

export interface UserFormData {
  username: string;
}

// ─── 컴포넌트 Props ───────────────────────────────────────────────────────────

export interface HabitCardProps {
  habit: Habit;
  onCheck: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export interface RewardBoxProps {
  rewardBox: RewardBox;
  onOpen: (boxId: string) => void;
}

export interface ProgressBarProps {
  current: number;
  target: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
