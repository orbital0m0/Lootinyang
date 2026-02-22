import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import { ACHIEVEMENTS_DATA } from '../utils/constants';
import { useToast } from './useToast';

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

    const newlyUnlocked: string[] = [];

    try {
      const allAchievements = ACHIEVEMENTS_DATA;
      const unlockedIds = getStore<string[]>(STORE_KEYS.USER_ACHIEVEMENTS, []);
      const unlockedSet = new Set(unlockedIds);

      for (const achievement of allAchievements) {
        if (unlockedSet.has(achievement.id)) continue;

        if (evaluateCondition(achievement.condition, context)) {
          setStore(STORE_KEYS.USER_ACHIEVEMENTS, [...unlockedIds, ...newlyUnlocked, achievement.id]);
          newlyUnlocked.push(achievement.id);

          showToast({
            type: 'achievement',
            title: `업적 달성: ${achievement.name}`,
            message: achievement.description,
            icon: achievement.icon,
            duration: 4000,
          });
        }
      }

      if (newlyUnlocked.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['userAchievements', context.userId] });
      }
    } catch (error) {
      console.error('업적 체크 실패:', error);
    } finally {
      setIsChecking(false);
    }

    return newlyUnlocked;
  }, [isChecking, queryClient, showToast]);

  return { checkAll, isChecking };
}
