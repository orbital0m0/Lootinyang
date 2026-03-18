import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import type { LocalUser } from '../services/localStore';
import { generateItems } from '../utils/rewardLogic';
import type { RewardBox, RewardItem, UserInventory } from '../types';
import { DEFAULT_INVENTORY } from '../types';
import { APP_CONFIG } from '../utils/constants';

export interface UseRewardsReturn {
  rewardBoxes: RewardBox[];
  availableBoxes: RewardBox[];
  openedBoxes: RewardBox[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createRewardBox: (type: RewardBox['type']) => Promise<RewardBox>;
  openRewardBox: (boxId: string) => Promise<{ box: RewardBox; items: RewardItem[]; bonusXp: number }>;
  getBoxesByType: (type: RewardBox['type']) => RewardBox[];
  getAvailableCount: (type: RewardBox['type']) => number;
  getBoxAnimationClass: (boxType: RewardBox['type']) => string;
  getBoxIcon: (boxType: RewardBox['type']) => string;
  getBoxColorTheme: (boxType: RewardBox['type']) => string;
  isCreating: boolean;
  isOpening: boolean;
}

export function useRewards(userId?: string): UseRewardsReturn {
  const queryClient = useQueryClient();

  const {
    data: rewardBoxes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['rewardBoxes', userId],
    queryFn: (): RewardBox[] => getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []),
    staleTime: Infinity,
    retry: false,
  });

  // 보상 상자 생성
  const createRewardBoxMutation = useMutation({
    mutationFn: async (type: RewardBox['type']): Promise<RewardBox> => {
      const boxes = getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []);
      const newBox: RewardBox = {
        id: crypto.randomUUID(),
        user_id: userId ?? '',
        type,
        is_opened: false,
        items: [],
        created_at: new Date().toISOString(),
      };
      setStore(STORE_KEYS.REWARD_BOXES, [...boxes, newBox]);
      return newBox;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardBoxes', userId] });
    },
  });

  // 상자 오픈 (아이템 생성 + 중복 XP 처리)
  const openRewardBoxMutation = useMutation({
    mutationFn: async (boxId: string): Promise<{ box: RewardBox; items: RewardItem[]; bonusXp: number }> => {
      const boxes = getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []);
      const box = boxes.find(b => b.id === boxId);
      if (!box) throw new Error('상자를 찾을 수 없습니다.');
      if (box.is_opened) throw new Error('이미 열린 상자입니다.');

      // 현재 소유 아이템 목록
      const inventory = getStore<UserInventory>(STORE_KEYS.INVENTORY, DEFAULT_INVENTORY);
      const ownedIds = inventory.ownedItems;

      // 랜덤 아이템 생성 (중복 여부 판단 포함)
      const results = generateItems(box.type, ownedIds);
      const newItems = results.map(r => r.item);
      const totalBonusXp = results.reduce((sum, r) => sum + r.bonusXp, 0);

      const now = new Date().toISOString();

      // 상자 업데이트
      const updatedBox: RewardBox = {
        ...box,
        is_opened: true,
        items: newItems,
        opened_at: now,
      };
      setStore(STORE_KEYS.REWARD_BOXES, boxes.map(b => b.id === boxId ? updatedBox : b));

      // 인벤토리에 새 아이템 추가 (중복이 아닌 것만)
      const newOwnedItems = [
        ...ownedIds,
        ...newItems.filter(item => !ownedIds.includes(item.id)).map(item => item.id),
      ];
      setStore(STORE_KEYS.INVENTORY, { ...inventory, ownedItems: newOwnedItems });

      // 중복 XP 처리
      if (totalBonusXp > 0) {
        const user = getStore<LocalUser | null>(STORE_KEYS.USER, null);
        if (user) {
          const newExp = user.exp + totalBonusXp;
          const newLevel = Math.min(
            Math.floor(newExp / APP_CONFIG.EXP_PER_LEVEL) + 1,
            APP_CONFIG.MAX_LEVEL
          );
          setStore(STORE_KEYS.USER, { ...user, exp: newExp, level: newLevel, updated_at: now });
        }
      }

      return { box: updatedBox, items: newItems, bonusXp: totalBonusXp };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardBoxes', userId] });
      queryClient.invalidateQueries({ queryKey: ['inventory', userId] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const availableBoxes = rewardBoxes.filter(box => !box.is_opened);
  const openedBoxes = rewardBoxes.filter(box => box.is_opened);

  const getBoxesByType = (type: RewardBox['type']) =>
    rewardBoxes.filter(box => box.type === type);

  const getAvailableCount = (type: RewardBox['type']) =>
    rewardBoxes.filter(box => box.type === type && !box.is_opened).length;

  const getBoxAnimationClass = (boxType: RewardBox['type']): string => {
    const map: Record<RewardBox['type'], string> = {
      normal: 'animate-pulse',
      premium: 'animate-bounce',
      event: 'animate-spin',
    };
    return map[boxType] || '';
  };

  const getBoxIcon = (boxType: RewardBox['type']): string => {
    const map: Record<RewardBox['type'], string> = {
      normal: '📦',
      premium: '🎁',
      event: '🏆',
    };
    return map[boxType] || '📦';
  };

  const getBoxColorTheme = (boxType: RewardBox['type']): string => {
    const map: Record<RewardBox['type'], string> = {
      normal: 'from-blue-400 to-blue-500',
      premium: 'from-purple-400 to-pink-500',
      event: 'from-amber-400 to-amber-500',
    };
    return map[boxType] || 'from-gray-400 to-gray-500';
  };

  const createRewardBox = async (type: RewardBox['type']) =>
    createRewardBoxMutation.mutateAsync(type);

  const openRewardBox = async (boxId: string) =>
    openRewardBoxMutation.mutateAsync(boxId);

  return {
    rewardBoxes,
    availableBoxes,
    openedBoxes,
    loading: isLoading,
    error: error?.message || null,
    refetch,
    createRewardBox,
    openRewardBox,
    getBoxesByType,
    getAvailableCount,
    getBoxAnimationClass,
    getBoxIcon,
    getBoxColorTheme,
    isCreating: createRewardBoxMutation.isPending,
    isOpening: openRewardBoxMutation.isPending,
  };
}
