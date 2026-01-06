import { useQuery } from '@tanstack/react-query';
import { supabaseHelpers } from '../services/supabase';
import type { RewardBox, UseRewardsReturn } from '../types';

// 보상 상자 관리 커스텀 훅
export function useRewards(userId?: string): UseRewardsReturn {
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
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 사용 가능한 상자 분류
  const availableBoxes = rewardBoxes.filter(box => !box.is_opened);
  const openedBoxes = rewardBoxes.filter(box => box.is_opened);

  // 상자 타입별 그룹화
  const getBoxesByType = (type: RewardBox['type']) => {
    return rewardBoxes.filter(box => box.type === type);
  };

  // 특정 타입의 사용 가능한 상자 수
  const getAvailableCount = (type: RewardBox['type']) => {
    return rewardBoxes.filter(box => box.type === type && !box.is_opened).length;
  };

  // 상자 열기 시간별레이션
  const getBoxAnimationClass = (boxType: RewardBox['type']): string => {
    const animationClasses = {
      daily: 'animate-pulse',
      weekly: 'animate-wiggle',
      monthly: 'animate-bounce',
      special: 'animate-spin',
    };
    return animationClasses[boxType] || '';
  };

  // 상자 아이콘
  const getBoxIcon = (boxType: RewardBox['type']): string => {
    const icons = {
      daily: '📦',
      weekly: '🎀',
      monthly: '🎁',
      special: '🏆',
    };
    return icons[boxType] || '📦';
  };

  // 상자 색상 테마
  const getBoxColorTheme = (boxType: RewardBox['type']): string => {
    const themes = {
      daily: 'from-blue-400 to-blue-500',
      weekly: 'from-purple-400 to-purple-500',
      monthly: 'from-pink-400 to-pink-500',
      special: 'from-amber-400 to-amber-500',
    };
    return themes[boxType] || 'from-gray-400 to-gray-500';
  };

  return {
    rewardBoxes,
    availableBoxes,
    openedBoxes,
    loading: isLoading,
    error: error?.message || null,
    refetch,
    getBoxesByType,
    getAvailableCount,
    getBoxAnimationClass,
    getBoxIcon,
    getBoxColorTheme,
  };
}