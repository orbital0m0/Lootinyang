import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '../services/supabase';
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

// 보상 상자 관리 커스텀 훅
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
    queryFn: () => {
      if (!userId) throw new Error('사용자 ID가 필요합니다.');
      return supabaseHelpers.getRewardBoxes(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // 보상 상자 생성
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

  // 상자 오픈 (아이템 생성 포함)
  const openRewardBoxMutation = useMutation({
    mutationFn: async (boxId: string) => {
      if (!userId) throw new Error('사용자 ID가 필요합니다.');

      // 상자 타입 조회
      const box = rewardBoxes.find(b => b.id === boxId);
      if (!box) throw new Error('상자를 찾을 수 없습니다.');
      if (box.is_opened) throw new Error('이미 열린 상자입니다.');

      // 랜덤 아이템 생성
      const items = generateItems(box.type);

      // 상자 열기 (DB 업데이트)
      const updatedBox = await supabaseHelpers.openRewardBox(boxId, items);

      // 생성된 아이템을 user_items에 추가
      for (const item of items) {
        await supabaseHelpers.addUserItem(userId, item.id, 1);
      }

      return { box: updatedBox, items };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardBoxes', userId] });
      queryClient.invalidateQueries({ queryKey: ['userItems', userId] });
    },
  });

  // 사용 가능한 상자 분류
  const availableBoxes = rewardBoxes.filter(box => !box.is_opened);
  const openedBoxes = rewardBoxes.filter(box => box.is_opened);

  const getBoxesByType = (type: RewardBox['type']) => {
    return rewardBoxes.filter(box => box.type === type);
  };

  const getAvailableCount = (type: RewardBox['type']) => {
    return rewardBoxes.filter(box => box.type === type && !box.is_opened).length;
  };

  const getBoxAnimationClass = (boxType: RewardBox['type']): string => {
    const animationClasses = {
      daily: 'animate-pulse',
      weekly: 'animate-wiggle',
      monthly: 'animate-bounce',
      special: 'animate-spin',
    };
    return animationClasses[boxType] || '';
  };

  const getBoxIcon = (boxType: RewardBox['type']): string => {
    const icons = {
      daily: '📦',
      weekly: '🎀',
      monthly: '🎁',
      special: '🏆',
    };
    return icons[boxType] || '📦';
  };

  const getBoxColorTheme = (boxType: RewardBox['type']): string => {
    const themes = {
      daily: 'from-blue-400 to-blue-500',
      weekly: 'from-purple-400 to-purple-500',
      monthly: 'from-pink-400 to-pink-500',
      special: 'from-amber-400 to-amber-500',
    };
    return themes[boxType] || 'from-gray-400 to-gray-500';
  };

  const createRewardBox = async (type: RewardBox['type']) => {
    return createRewardBoxMutation.mutateAsync(type);
  };

  const openRewardBox = async (boxId: string) => {
    return openRewardBoxMutation.mutateAsync(boxId);
  };

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
