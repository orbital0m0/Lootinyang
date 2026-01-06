import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '../services/supabase';
import type { Habit, UseHabitsReturn } from '../types';

// 습관 관리 커스텀 훅
export function useHabits(userId?: string): UseHabitsReturn {
  const queryClient = useQueryClient();

  // 습관 목록 조회
  const {
    data: habits = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['habits', userId],
    queryFn: () => {
      if (!userId) throw new Error('사용자 ID가 필요합니다.');
      return supabaseHelpers.getHabits(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 습관 생성
  const createHabitMutation = useMutation({
    mutationFn: async (habitData: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => {
      if (!userId) throw new Error('사용자 ID가 필요합니다.');
      return supabaseHelpers.createHabit({ ...habitData, user_id: userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] });
    },
    onError: (error) => {
      console.error('습관 생성 실패:', error);
    },
  });

  // 습관 수정
  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Habit> }) => {
      return supabaseHelpers.updateHabit(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
      queryClient.invalidateQueries({ queryKey: ['dailyChecks'] });
    },
    onError: (error) => {
      console.error('습관 수정 실패:', error);
    },
  });

  // 습관 삭제 (소프트 딜리트)
  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      return supabaseHelpers.deleteHabit(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] });
      queryClient.invalidateQueries({ queryKey: ['dailyChecks'] });
    },
    onError: (error) => {
      console.error('습관 삭제 실패:', error);
    },
  });

  const createHabit = async (habitData: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => {
    return createHabitMutation.mutateAsync(habitData);
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    return updateHabitMutation.mutateAsync({ id, updates });
  };

  const deleteHabit = async (id: string) => {
    return deleteHabitMutation.mutateAsync(id);
  };

  return {
    habits,
    loading: isLoading,
    error: error?.message || null,
    createHabit,
    updateHabit,
    deleteHabit,
    refetch,
    isCreating: createHabitMutation.isPending,
    isUpdating: updateHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
  };
}