import type { Habit, DailyCheck, RewardBox } from '../types';

// localStorage 키 상수
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

// localStorage 비활성화 환경 대비 메모리 폴백
const memoryStore = new Map<string, string>();

function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    console.error('[localStore] 저장 실패 (용량 초과 등):', key);
    memoryStore.set(key, value);
  }
}

function storageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    memoryStore.delete(key);
  }
}

// 타입 안전 getter
export function getStore<T>(key: string, defaultValue: T): T {
  const raw = storageGet(key);
  if (raw === null) return defaultValue;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

// 타입 안전 setter
export function setStore<T>(key: string, value: T): void {
  storageSet(key, JSON.stringify(value));
}

// 키 삭제
export function removeStore(key: string): void {
  storageRemove(key);
}

// 전체 앱 데이터 내보내기 (백업용)
export function exportAllData(): AppBackupData {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data: {
      user: getStore<LocalUser | null>(STORE_KEYS.USER, null),
      habits: getStore<Habit[]>(STORE_KEYS.HABITS, []),
      daily_checks: getStore<DailyCheck[]>(STORE_KEYS.DAILY_CHECKS, []),
      user_achievements: getStore<string[]>(STORE_KEYS.USER_ACHIEVEMENTS, []),
      user_items: getStore<LocalUserItem[]>(STORE_KEYS.USER_ITEMS, []),
      reward_boxes: getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []),
    },
  };
}

// 전체 앱 데이터 가져오기 (복원용)
export function importAllData(data: AppBackupData): void {
  setStore(STORE_KEYS.USER, data.data.user);
  setStore(STORE_KEYS.HABITS, data.data.habits);
  setStore(STORE_KEYS.DAILY_CHECKS, data.data.daily_checks);
  setStore(STORE_KEYS.USER_ACHIEVEMENTS, data.data.user_achievements);
  setStore(STORE_KEYS.USER_ITEMS, data.data.user_items);
  setStore(STORE_KEYS.REWARD_BOXES, data.data.reward_boxes);
  setStore(STORE_KEYS.ONBOARDED, true);
  setStore(STORE_KEYS.WARNED, true);
}

// LocalUser 타입
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

// 로컬 사용자 아이템 타입
export interface LocalUserItem {
  id: string;
  item_id: string;
  quantity: number;
  is_used: boolean;
  acquired_at: string;
}

// 백업 데이터 타입
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

// 아이템을 store에 직접 추가 (useRewards에서 내부 호출용)
export function addItemToStore(itemId: string, quantity = 1): void {
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
