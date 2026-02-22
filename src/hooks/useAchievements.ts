import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import { ACHIEVEMENTS_DATA } from '../utils/constants';
import type { Achievement, UserAchievement, UseAchievementsReturn } from '../types';

// 업적 관리 커스텀 훅 (localStorage 기반, 정적 데이터 사용)
export function useAchievements(userId?: string): UseAchievementsReturn {
  const queryClient = useQueryClient();

  // 모든 업적 목록 (정적 데이터)
  const {
    data: allAchievements = [],
  } = useQuery({
    queryKey: ['achievements'],
    queryFn: (): Achievement[] => ACHIEVEMENTS_DATA,
    staleTime: Infinity,
  });

  // 사용자가 달성한 업적 ID 목록 (localStorage)
  const {
    data: unlockedIds = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userAchievements', userId],
    queryFn: (): string[] => {
      return getStore<string[]>(STORE_KEYS.USER_ACHIEVEMENTS, []);
    },
    staleTime: Infinity,
    retry: false,
  });

  // UserAchievement 형식으로 변환 (하위 호환성)
  const userAchievements: UserAchievement[] = unlockedIds.map(id => ({
    id: `ua_${id}`,
    user_id: userId ?? '',
    achievement_id: id,
    unlocked_at: new Date().toISOString(),
  }));

  // 업적 달성
  const unlockAchievement = async (achievementId: string): Promise<boolean> => {
    try {
      const unlocked = getStore<string[]>(STORE_KEYS.USER_ACHIEVEMENTS, []);
      if (unlocked.includes(achievementId)) return false;
      setStore(STORE_KEYS.USER_ACHIEVEMENTS, [...unlocked, achievementId]);
      queryClient.invalidateQueries({ queryKey: ['userAchievements', userId] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });

      const achievement = allAchievements.find(a => a.id === achievementId);
      console.log('🏆 업적 달성:', achievement?.name);
      return true;
    } catch (error) {
      console.error('업적 달성 실패:', error);
      return false;
    }
  };

  // 업적 카테고리별 그룹화
  const getAchievementsByCategory = () => ({
    challenge: allAchievements.filter(a =>
      a.condition.startsWith('create_') || a.condition.startsWith('habit_')
    ),
    consistency: allAchievements.filter(a =>
      a.condition.includes('streak_') || a.condition.includes('_days')
    ),
    reward: allAchievements.filter(a =>
      a.condition.startsWith('open_') || a.condition.startsWith('reward_')
    ),
    legendary: allAchievements.filter(a =>
      a.condition.includes('level_') || a.condition.includes('perfect_')
    ),
  });

  // 업적 달성률 계산
  const getProgressByAchievement = (achievementId: string): number => {
    return unlockedIds.includes(achievementId) ? 100 : 0;
  };

  // 카테고리별 업적 통계
  const getStatsByCategory = () => {
    const overall = {
      total: allAchievements.length,
      unlocked: unlockedIds.length,
      percentage: allAchievements.length > 0
        ? Math.round((unlockedIds.length / allAchievements.length) * 100)
        : 0,
    };

    const categories = getAchievementsByCategory();
    const categoryStats = Object.entries(categories).map(([key, achievements]) => ({
      category: key,
      total: achievements.length,
      unlocked: achievements.filter(a => unlockedIds.includes(a.id)).length,
      percentage: achievements.length > 0
        ? Math.round(
            (achievements.filter(a => unlockedIds.includes(a.id)).length / achievements.length) * 100
          )
        : 0,
    }));

    return { overall, categories: categoryStats };
  };

  // 특정 업적 달성 여부 확인
  const isAchievementUnlocked = (achievementId: string): boolean => {
    return unlockedIds.includes(achievementId);
  };

  // 총 업적 포인트 계산
  const getTotalPoints = (): number => {
    return unlockedIds.reduce((total, id) => {
      const achievement = allAchievements.find(a => a.id === id);
      return total + (achievement?.points || 0);
    }, 0);
  };

  // 미달성 업적 목록
  const getLockedAchievements = () => {
    return allAchievements.filter(a => !unlockedIds.includes(a.id));
  };

  // 달성된 업적 목록
  const getUnlockedAchievements = () => {
    return userAchievements
      .map(ua => {
        const achievement = allAchievements.find(a => a.id === ua.achievement_id);
        return { ...ua, achievement: achievement! };
      })
      .filter(ua => ua.achievement)
      .sort((a, b) =>
        new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime()
      );
  };

  return {
    allAchievements,
    userAchievements,
    loading: isLoading,
    error: error?.message || null,
    refetch,
    unlockAchievement,
    getAchievementsByCategory,
    getProgressByAchievement,
    getStatsByCategory,
    isAchievementUnlocked,
    getTotalPoints,
    getLockedAchievements,
    getUnlockedAchievements,
  };
}
