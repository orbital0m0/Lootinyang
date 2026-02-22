import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import type { LocalUser } from '../services/localStore';
import { APP_CONFIG, UTILS } from '../utils/constants';
import { useToast } from './useToast';
import { useAchievementChecker } from './useAchievementChecker';
import type { Habit, RewardBox } from '../types';

export interface UseGameEventsReturn {
  processHabitCheck: (habitId: string, userId: string) => Promise<void>;
  processWeeklyTarget: (userId: string, habits: Habit[]) => Promise<void>;
  isProcessing: boolean;
}

export function useGameEvents(): UseGameEventsReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { checkAll: checkAchievements } = useAchievementChecker();

  // 스트릭 계산 및 업데이트
  const calculateAndUpdateStreak = useCallback(async (userId: string): Promise<number> => {
    const habits = getStore<Habit[]>(STORE_KEYS.HABITS, []).filter(h => h.is_active && h.user_id === userId);
    if (habits.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const allChecks = getStore<{ habit_id: string; date: string; completed: boolean }[]>(
      STORE_KEYS.DAILY_CHECKS, []
    );
    const todayCheckedIds = new Set(
      allChecks.filter(c => c.date === today && c.completed).map(c => c.habit_id)
    );

    const allChecked = habits.every(h => todayCheckedIds.has(h.id));
    if (!allChecked) return -1;

    const current = getStore<LocalUser | null>(STORE_KEYS.USER, null);
    const currentStreak = current?.streak ?? 0;
    const newStreak = currentStreak + 1;

    if (current) {
      setStore(STORE_KEYS.USER, { ...current, streak: newStreak, updated_at: new Date().toISOString() });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }

    return newStreak;
  }, [queryClient]);

  // 습관 체크 시 게임 이벤트 처리
  const processHabitCheck = useCallback(async (_habitId: string, userId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const current = getStore<LocalUser | null>(STORE_KEYS.USER, null);
      const currentStreak = current?.streak ?? 0;
      const baseExp = APP_CONFIG.DAILY_REWARD_EXP;
      const totalExp = UTILS.calculateStreakBonus(baseExp, currentStreak);

      const prevLevel = current?.level ?? 1;
      const newExp = (current?.exp ?? 0) + totalExp;
      const newLevel = Math.min(
        Math.floor(newExp / APP_CONFIG.EXP_PER_LEVEL) + 1,
        APP_CONFIG.MAX_LEVEL
      );

      if (current) {
        setStore(STORE_KEYS.USER, {
          ...current,
          exp: newExp,
          level: newLevel,
          updated_at: new Date().toISOString(),
        });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }

      // 경험치 토스트
      const bonusText = currentStreak >= 7 ? ` (x${APP_CONFIG.STREAK_BONUS_MULTIPLIER} bonus!)` : '';
      showToast({ type: 'success', title: `+${totalExp} EXP${bonusText}`, icon: '' });

      // 레벨업 체크
      if (newLevel > prevLevel) {
        showToast({
          type: 'levelup',
          title: `Level ${newLevel} 달성!`,
          message: '축하합니다!',
          icon: '',
          duration: 4000,
        });
      }

      // 스트릭 업데이트
      const newStreak = await calculateAndUpdateStreak(userId);
      if (newStreak > 0 && newStreak !== -1) {
        if (newStreak === 7 || newStreak === 30 || newStreak % 50 === 0) {
          showToast({
            type: 'achievement',
            title: `${newStreak}일 연속 달성!`,
            message: '대단해요! 계속 유지하세요!',
            icon: '',
            duration: 4000,
          });
        }
      }

      // 업적 자동 체크
      const habits = getStore<Habit[]>(STORE_KEYS.HABITS, []).filter(h => h.is_active);
      const rewardBoxes = getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []);
      const openedCount = rewardBoxes.filter(b => b.is_opened).length;

      await checkAchievements({
        userId,
        totalHabits: habits.length,
        streak: newStreak === -1 ? currentStreak : newStreak,
        level: newLevel,
        totalBoxesOpened: openedCount,
        weeklyTargetStreak: 0,
      });
    } catch (error) {
      console.error('게임 이벤트 처리 실패:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, queryClient, showToast, calculateAndUpdateStreak, checkAchievements]);

  // 주간 목표 달성 시 보상 처리
  const processWeeklyTarget = useCallback(async (userId: string, habits: Habit[]) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const today = new Date();
      const weekStart = UTILS.getWeekStart(today);
      const weekEnd = UTILS.getWeekEnd(today);
      const startDate = weekStart.toISOString().split('T')[0];
      const endDate = weekEnd.toISOString().split('T')[0];

      const allChecks = getStore<{ habit_id: string; date: string; completed: boolean }[]>(
        STORE_KEYS.DAILY_CHECKS, []
      );
      const weekChecks = allChecks.filter(c => c.date >= startDate && c.date <= endDate && c.completed);

      const allTargetsMet = habits.every(habit => {
        const habitChecks = weekChecks.filter(c => c.habit_id === habit.id);
        return habitChecks.length >= habit.weekly_target;
      });

      if (allTargetsMet && habits.length > 0) {
        // 주간 보상 상자 생성
        const boxes = getStore<RewardBox[]>(STORE_KEYS.REWARD_BOXES, []);
        const newBox: RewardBox = {
          id: crypto.randomUUID(),
          user_id: userId,
          type: 'weekly',
          is_opened: false,
          items: [],
          created_at: new Date().toISOString(),
        };
        setStore(STORE_KEYS.REWARD_BOXES, [...boxes, newBox]);

        // 주간 보너스 경험치
        const current = getStore<LocalUser | null>(STORE_KEYS.USER, null);
        if (current) {
          const newExp = current.exp + APP_CONFIG.WEEKLY_REWARD_EXP;
          const newLevel = Math.min(
            Math.floor(newExp / APP_CONFIG.EXP_PER_LEVEL) + 1,
            APP_CONFIG.MAX_LEVEL
          );
          setStore(STORE_KEYS.USER, { ...current, exp: newExp, level: newLevel, updated_at: new Date().toISOString() });
        }

        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        queryClient.invalidateQueries({ queryKey: ['rewardBoxes', userId] });

        showToast({
          type: 'reward',
          title: '주간 목표 달성!',
          message: `보상 상자 + ${APP_CONFIG.WEEKLY_REWARD_EXP} EXP 획득!`,
          icon: '',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('주간 목표 처리 실패:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, queryClient, showToast]);

  return { processHabitCheck, processWeeklyTarget, isProcessing };
}
