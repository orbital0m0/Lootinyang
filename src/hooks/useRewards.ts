import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, addItemToStore, STORE_KEYS } from '../services/localStore';
import { generateItems } from '../utils/rewardLogic';
import type { RewardBox, Item } from '../types';

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

// 보상 상자 관리 커스텀 훅 (localStorage 기반)
export function useRewards(userId?: string): UseRewardsReturn {
  const queryClient = useQueryClient();

  // 보상 상자 목록 조회
  const {
    data: rewardBoxes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['rewardBoxes', userId],
    queryFn: (): RewardBox[] => {
      return getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []);
    },
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

  // 상자 오픈 (아이템 생성 포함)
  const openRewardBoxMutation = useMutation({
    mutationFn: async (boxId: string): Promise<{ box: RewardBox; items: Item[] }> => {
      const boxes = getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []);
      const box = boxes.find(b => b.id === boxId);
      if (!box) throw new Error('상자를 찾을 수 없습니다.');
      if (box.is_opened) throw new Error('이미 열린 상자입니다.');

      // 랜덤 아이템 생성
      const generatedItems = generateItems(box.type);
      const now = new Date().toISOString();

      // 상자 업데이트
      const updatedBox: RewardBox = {
        ...box,
        is_opened: true,
        items: generatedItems,
        opened_at: now,
      };
      setStore(STORE_KEYS.REWARD_BOXES, boxes.map(b => b.id === boxId ? updatedBox : b));

      // 아이템 user_items에 추가
      generatedItems.forEach(item => addItemToStore(item.id, 1));

      return { box: updatedBox, items: generatedItems };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardBoxes', userId] });
      queryClient.invalidateQueries({ queryKey: ['userItems', userId] });
    },
  });

  const availableBoxes = rewardBoxes.filter(box => !box.is_opened);
  const openedBoxes = rewardBoxes.filter(box => box.is_opened);

  const getBoxesByType = (type: RewardBox['type']) =>
    rewardBoxes.filter(box => box.type === type);

  const getAvailableCount = (type: RewardBox['type']) =>
    rewardBoxes.filter(box => box.type === type && !box.is_opened).length;

  const getBoxAnimationClass = (boxType: RewardBox['type']): string => {
    const map = { daily: 'animate-pulse', weekly: 'animate-wiggle', monthly: 'animate-bounce', special: 'animate-spin' };
    return map[boxType] || '';
  };

  const getBoxIcon = (boxType: RewardBox['type']): string => {
    const map = { daily: '📦', weekly: '🎀', monthly: '🎁', special: '🏆' };
    return map[boxType] || '📦';
  };

  const getBoxColorTheme = (boxType: RewardBox['type']): string => {
    const map = {
      daily: 'from-blue-400 to-blue-500',
      weekly: 'from-purple-400 to-purple-500',
      monthly: 'from-pink-400 to-pink-500',
      special: 'from-amber-400 to-amber-500',
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
