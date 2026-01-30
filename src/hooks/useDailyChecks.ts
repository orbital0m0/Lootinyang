import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '../services/supabase';
import type { UseDailyChecksReturn } from '../types';

// DailyCheck 타입 정의
interface DailyCheckData {
  habit_id: string;
  date: string;
  completed: boolean;
}

// 주간 날짜 범위 계산 헬퍼
function getWeekDateRange() {
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    startDate: startOfWeek.toISOString().split('T')[0],
    endDate: endOfWeek.toISOString().split('T')[0],
  };
}

// 일일 체크 관리 커스텀 훅
export function useDailyChecks(userId?: string): UseDailyChecksReturn {
  const queryClient = useQueryClient();

  // 사용자의 모든 습관에 대한 주간 일일 체크 목록 조회
  const {
    data: dailyChecks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dailyChecks', userId],
    queryFn: async () => {
      if (!userId) throw new Error('사용자 ID가 필요합니다.');

      const { startDate, endDate } = getWeekDateRange();
      return supabaseHelpers.getDailyChecksByUser(userId, startDate, endDate);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 1, // 1분
  });

  // 습관 체크
  const checkHabitMutation = useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
      return supabaseHelpers.checkHabit(habitId, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyChecks', userId] });
      queryClient.invalidateQueries({ queryKey: ['weeklyProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      console.error('습관 체크 실패:', error);
    },
  });

  // 습관 체크 해제
  const uncheckHabitMutation = useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
      return supabaseHelpers.uncheckHabit(habitId, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyChecks', userId] });
      queryClient.invalidateQueries({ queryKey: ['weeklyProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      console.error('습관 체크 해제 실패:', error);
    },
  });

  const checkHabit = async (habitId: string, date: string) => {
    return checkHabitMutation.mutateAsync({ habitId, date });
  };

  const uncheckHabit = async (habitId: string, date: string) => {
    return uncheckHabitMutation.mutateAsync({ habitId, date });
  };

  // 주간 진행률 계산
  const getWeeklyProgress = (habitId: string, weeklyTarget: number): number => {
    if (!habitId || !weeklyTarget) return 0;

    const thisWeekChecks = dailyChecks.filter(
      (check: DailyCheckData) => check.habit_id === habitId && check.completed
    );

    return Math.min((thisWeekChecks.length / weeklyTarget) * 100, 100);
  };

  // 특정 날짜 체크 여부 확인
  const isDateChecked = (habitId: string, date: string): boolean => {
    return dailyChecks.some(
      (check: DailyCheckData) =>
        check.habit_id === habitId && check.date === date && check.completed
    );
  };

  // 오늘 체크 여부 확인
  const isTodayChecked = (habitId: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return isDateChecked(habitId, today);
  };

  // 이번 주 체크된 날짜 목록
  const getCheckedDatesThisWeek = (habitId: string): string[] => {
    return dailyChecks
      .filter((check: DailyCheckData) => check.habit_id === habitId && check.completed)
      .map((check: DailyCheckData) => check.date);
  };

  return {
    dailyChecks,
    loading: isLoading,
    error: error?.message || null,
    checkHabit,
    uncheckHabit,
    getWeeklyProgress,
    isTodayChecked,
    isDateChecked,
    getCheckedDatesThisWeek,
    refetch,
    isChecking: checkHabitMutation.isPending,
    isUnchecking: uncheckHabitMutation.isPending,
  };
}
