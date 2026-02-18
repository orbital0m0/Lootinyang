// 기본 타입 정의
export interface User {
  id: string;
  auth_id?: string;
  username: string;
  email?: string;
  level: number;
  exp: number;
  total_habits?: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  weekly_target: number; // 주 N회
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface DailyCheck {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD 형식
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'random' | 'protection' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  icon: string;
  effect?: string;
}

export interface RewardBox {
  id: string;
  user_id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  is_opened: boolean;
  items: Item[];
  created_at: string;
  opened_at?: string;
}

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

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

// 컴포넌트 Props 타입
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

// 훅 관련 타입
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
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (updates: Partial<User>) => Promise<void>;
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
  openRewardBox: (boxId: string) => Promise<{ box: RewardBox; items: Item[] }>;
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

// 사용자 아이템
export interface UserItem {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  is_used: boolean;
  acquired_at: string;
  item?: Item;
}

// 토스트 알림
export interface Toast {
  id: string;
  type: 'success' | 'achievement' | 'levelup' | 'reward' | 'info';
  title: string;
  message?: string;
  icon?: string;
  duration?: number;
}

// 게임 관련 타입
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

// 폼 관련 타입
export interface HabitFormData {
  name: string;
  weekly_target: number;
}

export interface UserFormData {
  username: string;
}