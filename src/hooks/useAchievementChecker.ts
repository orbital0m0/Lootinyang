import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '../services/supabase';
import { useToast } from './useToast';
import type { Achievement, UserAchievement } from '../types';

export interface AchievementCheckContext {
  userId: string;
  totalHabits: number;
  streak: number;
  level: number;
  totalBoxesOpened: number;
  weeklyTargetStreak: number;
}

export interface UseAchievementCheckerReturn {
  checkAll: (context: AchievementCheckContext) => Promise<string[]>;
  isChecking: boolean;
}

// 업적 condition과 검사 로직 매핑
function evaluateCondition(condition: string, ctx: AchievementCheckContext): boolean {
  switch (condition) {
    case 'create_first_habit':
      return ctx.totalHabits >= 1;
    case 'streak_7_days':
      return ctx.streak >= 7;
    case 'streak_30_days':
      return ctx.streak >= 30;
    case 'three_weeks_success':
      return ctx.weeklyTargetStreak >= 3;
    case 'create_5_habits':
      return ctx.totalHabits >= 5;
    case 'open_10_boxes':
      return ctx.totalBoxesOpened >= 10;
    case 'reach_level_50':
      return ctx.level >= 50;
    case 'perfect_month':
      // perfect_month는 별도의 복잡한 계산이 필요하므로
      // 여기서는 false 반환하고, 월말 체크 시 별도 로직으로 처리
      return false;
    default:
      return false;
  }
}

export function useAchievementChecker(): UseAchievementCheckerReturn {
  const [isChecking, setIsChecking] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const checkAll = useCallback(async (context: AchievementCheckContext): Promise<string[]> => {
    if (isChecking) return [];
    setIsChecking(true);

    const unlockedIds: string[] = [];

    try {
      // 모든 업적 목록 가져오기 (캐시에서 시도)
      let allAchievements = queryClient.getQueryData<Achievement[]>(['achievements']);
      if (!allAchievements) {
        allAchievements = await supabaseHelpers.getAchievements();
      }

      // 사용자가 이미 달성한 업적 목록
      let userAchievements = queryClient.getQueryData<UserAchievement[]>(['userAchievements', context.userId]);
      if (!userAchievements) {
        userAchievements = await supabaseHelpers.getUserAchievements(context.userId);
      }

      const unlockedSet = new Set(
        userAchievements.map((ua: UserAchievement) => ua.achievement_id)
      );

      // 미달성 업적에 대해 조건 검사
      for (const achievement of allAchievements) {
        if (unlockedSet.has(achievement.id)) continue;

        const met = evaluateCondition(achievement.condition, context);
        if (met) {
          try {
            await supabaseHelpers.unlockAchievement(context.userId, achievement.id);
            unlockedIds.push(achievement.id);

            showToast({
              type: 'achievement',
              title: `업적 달성: ${achievement.name}`,
              message: achievement.description,
              icon: achievement.icon,
              duration: 4000,
            });
          } catch (err) {
            console.error(`업적 ${achievement.id} 달성 저장 실패:`, err);
          }
        }
      }

      // 캐시 갱신
      if (unlockedIds.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['userAchievements', context.userId] });
      }
    } catch (error) {
      console.error('업적 체크 실패:', error);
    } finally {
      setIsChecking(false);
    }

    return unlockedIds;
  }, [isChecking, queryClient, showToast]);

  return { checkAll, isChecking };
}
