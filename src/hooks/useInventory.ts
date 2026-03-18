import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import { REWARD_ITEMS } from '../utils/constants';
import { applyTheme } from '../utils/themes';
import type { RewardItem, UserInventory, ItemCategory } from '../types';
import { DEFAULT_INVENTORY } from '../types';

// 항상 기본 소유 (해금 없이 사용 가능한 스타터 아이템)
export const DEFAULT_OWNED_IDS = new Set([
  'warm-white',    // theme
  'pretendard',    // font
  'simple-check',  // checkAnimation
  'solid-bar',     // progressBar
]);

export interface UseInventoryReturn {
  // 소유 아이템 (기본 소유 포함)
  ownedItems: RewardItem[];

  // 장착 상태
  equipped: UserInventory['equipped'];

  // 장착 액션
  equipItem: (itemId: string) => void;
  unequipItem: (category: ItemCategory) => void;

  // 쿼리 유틸
  isOwned: (itemId: string) => boolean;
  isEquipped: (itemId: string) => boolean;
  getEquippedInCategory: (category: ItemCategory) => string;

  // 카테고리 뷰 — Items 탭용
  getItemsByCategory: (category: ItemCategory | 'all') => {
    owned: RewardItem[];
    locked: RewardItem[];
  };

  loading: boolean;
  refetch: () => void;
}

// 카테고리별 장착 기본값
const CATEGORY_DEFAULTS: Record<ItemCategory, string> = {
  theme: 'warm-white',
  font: 'pretendard',
  textColor: 'default',
  checkAnimation: 'simple-check',
  progressBar: 'solid-bar',
  sticker: '',
};

function readInventory(): UserInventory {
  return getStore<UserInventory>(STORE_KEYS.INVENTORY, DEFAULT_INVENTORY);
}

function writeInventory(inv: UserInventory): void {
  setStore(STORE_KEYS.INVENTORY, inv);
}

// 아이템 ID가 소유 상태인지 (기본 소유 포함)
function checkIsOwned(itemId: string, inv: UserInventory): boolean {
  return DEFAULT_OWNED_IDS.has(itemId) || inv.ownedItems.includes(itemId);
}

export function useInventory(): UseInventoryReturn {
  const queryClient = useQueryClient();

  const {
    data: inventory = DEFAULT_INVENTORY,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['inventory'],
    queryFn: readInventory,
    staleTime: Infinity,
    retry: false,
  });

  // 소유 아이템 목록 (기본 소유 + 획득 아이템)
  const ownedItemIds = new Set([
    ...DEFAULT_OWNED_IDS,
    ...inventory.ownedItems,
  ]);
  const ownedItems = REWARD_ITEMS.filter(item => ownedItemIds.has(item.id));

  // ── 장착 mutation ─────────────────────────────────────────────────────────

  const equipMutation = useMutation({
    mutationFn: async (itemId: string): Promise<void> => {
      const inv = readInventory();
      if (!checkIsOwned(itemId, inv)) return;

      const item = REWARD_ITEMS.find(i => i.id === itemId);
      if (!item) return;

      const category = item.category;
      const newEquipped = { ...inv.equipped, [category]: itemId };
      writeInventory({ ...inv, equipped: newEquipped });

      // 카테고리별 즉시 적용
      if (category === 'theme') {
        applyTheme(itemId);
        setStore(STORE_KEYS.THEME, itemId);
      }
      // font: Task에서 추후 applyFont() 연동
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const unequipMutation = useMutation({
    mutationFn: async (category: ItemCategory): Promise<void> => {
      const inv = readInventory();
      const defaultId = CATEGORY_DEFAULTS[category];
      const newEquipped = { ...inv.equipped, [category]: defaultId };
      writeInventory({ ...inv, equipped: newEquipped });

      if (category === 'theme') {
        applyTheme(defaultId);
        setStore(STORE_KEYS.THEME, defaultId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  // ── 유틸 함수 ─────────────────────────────────────────────────────────────

  const isOwned = (itemId: string): boolean =>
    checkIsOwned(itemId, inventory);

  const isEquipped = (itemId: string): boolean => {
    const item = REWARD_ITEMS.find(i => i.id === itemId);
    if (!item) return false;
    return inventory.equipped[item.category as keyof typeof inventory.equipped] === itemId;
  };

  const getEquippedInCategory = (category: ItemCategory): string => {
    const val = inventory.equipped[category as keyof typeof inventory.equipped];
    if (typeof val === 'string') return val;
    return CATEGORY_DEFAULTS[category];
  };

  // 카테고리별 owned/locked 분류 (Items 탭 그리드용)
  const getItemsByCategory = (category: ItemCategory | 'all'): {
    owned: RewardItem[];
    locked: RewardItem[];
  } => {
    const pool = category === 'all'
      ? REWARD_ITEMS
      : REWARD_ITEMS.filter(item => item.category === category);

    const owned: RewardItem[] = [];
    const locked: RewardItem[] = [];

    pool.forEach(item => {
      if (checkIsOwned(item.id, inventory)) {
        owned.push(item);
      } else {
        locked.push(item);
      }
    });

    return { owned, locked };
  };

  return {
    ownedItems,
    equipped: inventory.equipped,
    equipItem: (itemId) => equipMutation.mutate(itemId),
    unequipItem: (category) => unequipMutation.mutate(category),
    isOwned,
    isEquipped,
    getEquippedInCategory,
    getItemsByCategory,
    loading: isLoading,
    refetch,
  };
}
