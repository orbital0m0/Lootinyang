import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '../services/supabase';
import type { UseAchievementsReturn } from '../types';

// 업적 관리 커스텀 훅
export function useAchievements(userId?: string): UseAchievementsReturn {
  const queryClient = useQueryClient();

  // 모든 업적 목록 조회
  const {
    data: allAchievements = [],
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => supabaseHelpers.getAchievements(),
    staleTime: 1000 * 60 * 30, // 30분
  });

  // 사용자 업적 조회
  const {
    data: userAchievements = [],
    isLoading: userAchievementsLoading,
    error: userAchievementsError,
    refetch,
  } = useQuery({
    queryKey: ['userAchievements', userId],
    queryFn: () => {
      if (!userId) throw new Error('사용자 ID가 필요합니다.');
      return supabaseHelpers.getUserAchievements(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 업적 달성
  const unlockAchievement = async (achievementId: string) => {
    if (!userId) throw new Error('사용자 ID가 필요합니다.');
    
    try {
      await supabaseHelpers.unlockAchievement(userId, achievementId);
      queryClient.invalidateQueries({ queryKey: ['userAchievements', userId] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      
      // 업적 달성 로그
      const achievement = allAchievements.find(a => a.id === achievementId);
      console.log('🏆 업적 달성:', achievement?.name);
      
      return true;
    } catch (error) {
      console.error('업적 달성 실패:', error);
      return false;
    }
  };

  // 업적 카테고리별 그룹화
  const getAchievementsByCategory = () => {
    const categories = {
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
    };

    return categories;
  };

  // 업적 달성률 계산
  const getProgressByAchievement = (achievementId: string): number => {
    const userAchievement = userAchievements.find(ua => ua.achievement_id === achievementId);
    return userAchievement ? 100 : 0;
  };

  // 카테고리별 업적 통계
  const getStatsByCategory = () => {
    const stats = {
      total: allAchievements.length,
      unlocked: userAchievements.length,
      percentage: Math.round((userAchievements.length / allAchievements.length) * 100),
    };

    const categories = getAchievementsByCategory();
    const categoryStats = Object.entries(categories).map(([key, achievements]) => ({
      category: key,
      total: achievements.length,
      unlocked: achievements.filter(a => 
        userAchievements.some(ua => ua.achievement_id === a.id)
      ).length,
      percentage: Math.round(
        (achievements.filter(a => 
          userAchievements.some(ua => ua.achievement_id === a.id)
        ).length / achievements.length) * 100
      ),
    }));

    return { overall: stats, categories: categoryStats };
  };

  // 특정 업적 달성 여부 확인
  const isAchievementUnlocked = (achievementId: string): boolean => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  // 총 업적 포인트 계산
  const getTotalPoints = (): number => {
    return userAchievements.reduce((total, ua) => {
      const achievement = allAchievements.find(a => a.id === ua.achievement_id);
      return total + (achievement?.points || 0);
    }, 0);
  };

  // 미달성 업적 목록
  const getLockedAchievements = () => {
    return allAchievements.filter(achievement => 
      !userAchievements.some(ua => ua.achievement_id === achievement.id)
    );
  };

  // 달성된 업적 목록 (최신순)
  const getUnlockedAchievements = () => {
    return userAchievements
      .map(ua => {
        const achievement = allAchievements.find(a => a.id === ua.achievement_id);
        return {
          ...ua,
          achievement,
        };
      })
      .sort((a, b) => 
        new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime()
      );
  };

  const loading = achievementsLoading || userAchievementsLoading;
  const error = achievementsError?.message || userAchievementsError?.message || null;

  return {
    allAchievements,
    userAchievements,
    loading,
    error,
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