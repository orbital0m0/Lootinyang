import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import type { DailyCheck, UseDailyChecksReturn } from '../types';

// 90일 초과 체크 자동 정리 (용량 관리)
function pruneOldChecks(checks: DailyCheck[]): DailyCheck[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  return checks.filter(c => c.date >= cutoffStr);
}

// 일일 체크 관리 커스텀 훅 (localStorage 기반)
export function useDailyChecks(userId?: string): UseDailyChecksReturn {
  const queryClient = useQueryClient();

  // 전체 일일 체크 조회 (이번 주 필터 없이 전체 저장, 뷰에서 필터)
  const {
    data: dailyChecks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dailyChecks', userId],
    queryFn: (): DailyCheck[] => {
      return getStore<DailyCheck[]>(STORE_KEYS.DAILY_CHECKS, []);
    },
    staleTime: Infinity,
    retry: false,
  });

  // 습관 체크
  const checkHabitMutation = useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }): Promise<DailyCheck> => {
      const checks = getStore<DailyCheck[]>(STORE_KEYS.DAILY_CHECKS, []);
      const now = new Date().toISOString();
      const existing = checks.find(c => c.habit_id === habitId && c.date === date);

      let result: DailyCheck;
      if (existing) {
        result = { ...existing, completed: true, updated_at: now };
        setStore(STORE_KEYS.DAILY_CHECKS, checks.map(c =>
          c.id === existing.id ? result : c
        ));
      } else {
        result = {
          id: crypto.randomUUID(),
          habit_id: habitId,
          date,
          completed: true,
          created_at: now,
          updated_at: now,
        };
        const updated = pruneOldChecks([...checks, result]);
        setStore(STORE_KEYS.DAILY_CHECKS, updated);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyChecks', userId] });
      queryClient.invalidateQueries({ queryKey: ['weeklyProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
  });

  // 습관 체크 해제
  const uncheckHabitMutation = useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }): Promise<DailyCheck | null> => {
      const checks = getStore<DailyCheck[]>(STORE_KEYS.DAILY_CHECKS, []);
      const now = new Date().toISOString();
      const existing = checks.find(c => c.habit_id === habitId && c.date === date);
      if (!existing) return null;

      const result = { ...existing, completed: false, updated_at: now };
      setStore(STORE_KEYS.DAILY_CHECKS, checks.map(c =>
        c.id === existing.id ? result : c
      ));
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyChecks', userId] });
      queryClient.invalidateQueries({ queryKey: ['weeklyProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
  });

  const checkHabit = async (habitId: string, date: string) => {
    await checkHabitMutation.mutateAsync({ habitId, date });
  };

  const uncheckHabit = async (habitId: string, date: string) => {
    await uncheckHabitMutation.mutateAsync({ habitId, date });
  };

  // 주간 진행률 계산 (이번 주 체크만)
  const getWeeklyProgress = (habitId: string, weeklyTarget: number): number => {
    if (!habitId || !weeklyTarget) return 0;
    const today = new Date();
    const day = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const thisWeekChecks = dailyChecks.filter(
      c => c.habit_id === habitId && c.completed && c.date >= weekStartStr
    );
    return Math.min((thisWeekChecks.length / weeklyTarget) * 100, 100);
  };

  // 특정 날짜 체크 여부 확인
  const isDateChecked = (habitId: string, date: string): boolean => {
    return dailyChecks.some(c => c.habit_id === habitId && c.date === date && c.completed);
  };

  // 오늘 체크 여부 확인
  const isTodayChecked = (habitId: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return isDateChecked(habitId, today);
  };

  // 이번 주 체크된 날짜 목록
  const getCheckedDatesThisWeek = (habitId: string): string[] => {
    const today = new Date();
    const day = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
    const weekStartStr = weekStart.toISOString().split('T')[0];

    return dailyChecks
      .filter(c => c.habit_id === habitId && c.completed && c.date >= weekStartStr)
      .map(c => c.date);
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
