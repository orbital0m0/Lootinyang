import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '../services/supabase';
import { APP_CONFIG, UTILS } from '../utils/constants';
import { useToast } from './useToast';
import { useAchievementChecker } from './useAchievementChecker';
import type { Habit, RewardBox } from '../types';

interface DailyCheckRecord {
  habit_id: string;
  date: string;
  completed: boolean;
}

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
    // 사용자의 모든 활성 습관 조회
    const habits = await supabaseHelpers.getHabits(userId);
    if (habits.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];

    // 오늘의 모든 습관 체크 상태 조회
    const checks = await supabaseHelpers.getDailyChecksByUser(userId, today, today);
    const checkedHabitIds = new Set(
      checks
        .filter((c: DailyCheckRecord) => c.completed)
        .map((c: DailyCheckRecord) => c.habit_id)
    );

    // 모든 습관을 체크했는지 확인
    const allChecked = habits.every((h: Habit) => checkedHabitIds.has(h.id));

    if (!allChecked) {
      // 아직 모든 습관을 완료하지 않았으면 현재 streak 유지
      return -1; // -1은 업데이트 필요 없음을 의미
    }

    // 현재 사용자 정보에서 streak 가져오기
    const userData = queryClient.getQueryData<{ streak: number }>(['currentUser']);
    const currentStreak = userData?.streak ?? 0;
    const newStreak = currentStreak + 1;

    // DB 업데이트
    await supabaseHelpers.updateUser(userId, { streak: newStreak });
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });

    return newStreak;
  }, [queryClient]);

  // 습관 체크 시 게임 이벤트 처리
  const processHabitCheck = useCallback(async (habitId: string, userId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. 경험치 부여
      const userData = queryClient.getQueryData<{ exp: number; level: number; streak: number }>(['currentUser']);
      const currentStreak = userData?.streak ?? 0;
      const baseExp = APP_CONFIG.DAILY_REWARD_EXP;
      const totalExp = UTILS.calculateStreakBonus(baseExp, currentStreak);

      const prevLevel = userData?.level ?? 1;
      const newExp = (userData?.exp ?? 0) + totalExp;
      const newLevel = Math.min(
        Math.floor(newExp / APP_CONFIG.EXP_PER_LEVEL) + 1,
        APP_CONFIG.MAX_LEVEL
      );

      await supabaseHelpers.updateUser(userId, { exp: newExp, level: newLevel });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });

      // 경험치 토스트
      const bonusText = currentStreak >= 7 ? ` (x${APP_CONFIG.STREAK_BONUS_MULTIPLIER} bonus!)` : '';
      showToast({
        type: 'success',
        title: `+${totalExp} EXP${bonusText}`,
        icon: '',
      });

      // 2. 레벨업 체크
      if (newLevel > prevLevel) {
        showToast({
          type: 'levelup',
          title: `Level ${newLevel} 달성!`,
          message: '축하합니다!',
          icon: '',
          duration: 4000,
        });
      }

      // 3. 스트릭 업데이트
      const newStreak = await calculateAndUpdateStreak(userId);
      if (newStreak > 0 && newStreak !== -1) {
        // 스트릭 마일스톤 알림
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

      // 4. 업적 자동 체크
      const habits = await supabaseHelpers.getHabits(userId);
      const rewardBoxes = await supabaseHelpers.getRewardBoxes(userId);
      const openedCount = rewardBoxes.filter((b: RewardBox) => b.is_opened).length;

      await checkAchievements({
        userId,
        totalHabits: habits.length,
        streak: newStreak === -1 ? (userData?.streak ?? 0) : newStreak,
        level: newLevel,
        totalBoxesOpened: openedCount,
        weeklyTargetStreak: 0, // 주간 달성 연속 카운트는 별도 추적 필요
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
      // 이번 주 시작~끝 계산
      const today = new Date();
      const weekStart = UTILS.getWeekStart(today);
      const weekEnd = UTILS.getWeekEnd(today);
      const startDate = weekStart.toISOString().split('T')[0];
      const endDate = weekEnd.toISOString().split('T')[0];

      // 이번 주 모든 체크 데이터 조회
      const checks = await supabaseHelpers.getDailyChecksByUser(userId, startDate, endDate);

      // 모든 습관이 주간 목표를 달성했는지 확인
      const allTargetsMet = habits.every(habit => {
        const habitChecks = checks.filter(
          (c: DailyCheckRecord) => c.habit_id === habit.id && c.completed
        );
        return habitChecks.length >= habit.weekly_target;
      });

      if (allTargetsMet && habits.length > 0) {
        // 주간 보상 상자 생성
        await supabaseHelpers.createRewardBox({
          user_id: userId,
          type: 'weekly',
          is_opened: false,
          items: [],
        });

        // 주간 보너스 경험치
        const userData = queryClient.getQueryData<{ exp: number; level: number }>(['currentUser']);
        const newExp = (userData?.exp ?? 0) + APP_CONFIG.WEEKLY_REWARD_EXP;
        const newLevel = Math.min(
          Math.floor(newExp / APP_CONFIG.EXP_PER_LEVEL) + 1,
          APP_CONFIG.MAX_LEVEL
        );

        await supabaseHelpers.updateUser(userId, { exp: newExp, level: newLevel });

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

  return {
    processHabitCheck,
    processWeeklyTarget,
    isProcessing,
  };
}
