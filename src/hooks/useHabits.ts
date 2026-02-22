import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import type { Habit, UseHabitsReturn } from '../types';

// 습관 관리 커스텀 훅 (localStorage 기반)
export function useHabits(userId?: string): UseHabitsReturn {
  const queryClient = useQueryClient();

  // 활성 습관 목록 조회
  const {
    data: habits = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['habits', userId],
    queryFn: (): Habit[] => {
      return getStore<Habit[]>(STORE_KEYS.HABITS, []).filter(h => h.is_active);
    },
    staleTime: Infinity,
    retry: false,
  });

  // 습관 생성
  const createHabitMutation = useMutation({
    mutationFn: async (habitData: Omit<Habit, 'id' | 'created_at' | 'updated_at'>): Promise<Habit> => {
      const habits = getStore<Habit[]>(STORE_KEYS.HABITS, []);
      const now = new Date().toISOString();
      const newHabit: Habit = {
        ...habitData,
        id: crypto.randomUUID(),
        user_id: userId ?? '',
        created_at: now,
        updated_at: now,
      };
      setStore(STORE_KEYS.HABITS, [...habits, newHabit]);
      return newHabit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] });
    },
  });

  // 습관 수정
  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Habit> }): Promise<Habit> => {
      const habits = getStore<Habit[]>(STORE_KEYS.HABITS, []);
      const updated = habits.map(h =>
        h.id === id ? { ...h, ...updates, updated_at: new Date().toISOString() } : h
      );
      setStore(STORE_KEYS.HABITS, updated);
      return updated.find(h => h.id === id)!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
      queryClient.invalidateQueries({ queryKey: ['dailyChecks'] });
    },
  });

  // 습관 삭제 (소프트 딜리트)
  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const habits = getStore<Habit[]>(STORE_KEYS.HABITS, []);
      setStore(STORE_KEYS.HABITS, habits.map(h =>
        h.id === id ? { ...h, is_active: false, updated_at: new Date().toISOString() } : h
      ));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', userId] });
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] });
      queryClient.invalidateQueries({ queryKey: ['dailyChecks'] });
    },
  });

  const createHabit = async (habitData: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => {
    await createHabitMutation.mutateAsync(habitData);
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    await updateHabitMutation.mutateAsync({ id, updates });
  };

  const deleteHabit = async (id: string) => {
    await deleteHabitMutation.mutateAsync(id);
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
