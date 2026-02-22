import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import type { LocalUser } from '../services/localStore';
import { APP_CONFIG } from '../utils/constants';
import type { UseUserReturn } from '../types';

const DEFAULT_USER: LocalUser = {
  id: '',
  username: 'User',
  level: 1,
  exp: 0,
  streak: 0,
  total_habits: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// 사용자 정보 관리 커스텀 훅
export function useUser(): UseUserReturn {
  const queryClient = useQueryClient();

  // 현재 사용자 정보 조회 (localStorage 기반)
  const {
    data: user = DEFAULT_USER,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: (): LocalUser => {
      const stored = getStore<LocalUser | null>(STORE_KEYS.USER, null);
      if (stored) return stored;

      // 최초 방문: LocalUser 자동 생성
      const newUser: LocalUser = {
        id: crypto.randomUUID(),
        username: 'User',
        level: 1,
        exp: 0,
        streak: 0,
        total_habits: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setStore(STORE_KEYS.USER, newUser);
      return newUser;
    },
    staleTime: Infinity,
    retry: false,
  });

  // 사용자 정보 업데이트
  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<LocalUser>): Promise<LocalUser> => {
      const current = getStore<LocalUser>(STORE_KEYS.USER, DEFAULT_USER);
      const updated: LocalUser = {
        ...current,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      setStore(STORE_KEYS.USER, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // 경험치 추가
  const addExpMutation = useMutation({
    mutationFn: async (exp: number): Promise<LocalUser> => {
      const current = getStore<LocalUser>(STORE_KEYS.USER, DEFAULT_USER);
      const newExp = current.exp + exp;
      const newLevel = Math.min(
        Math.floor(newExp / APP_CONFIG.EXP_PER_LEVEL) + 1,
        APP_CONFIG.MAX_LEVEL
      );
      const updated: LocalUser = {
        ...current,
        exp: newExp,
        level: newLevel,
        updated_at: new Date().toISOString(),
      };
      setStore(STORE_KEYS.USER, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // 스트릭 업데이트
  const updateStreakMutation = useMutation({
    mutationFn: async (streak: number): Promise<LocalUser> => {
      const current = getStore<LocalUser>(STORE_KEYS.USER, DEFAULT_USER);
      const updated: LocalUser = {
        ...current,
        streak,
        updated_at: new Date().toISOString(),
      };
      setStore(STORE_KEYS.USER, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const updateUser = async (updates: Partial<LocalUser>) => {
    await updateUserMutation.mutateAsync(updates);
  };

  const addExp = async (exp: number) => {
    await addExpMutation.mutateAsync(exp);
  };

  const updateStreak = async (streak: number) => {
    await updateStreakMutation.mutateAsync(streak);
  };

  // 레벨업 경험치 계산
  const getExpToNextLevel = (): number => {
    const currentLevel = Math.floor(user.exp / APP_CONFIG.EXP_PER_LEVEL) + 1;
    return (currentLevel * APP_CONFIG.EXP_PER_LEVEL) - user.exp;
  };

  // 레벨업 가능 여부
  const canLevelUp = (): boolean => {
    return user.exp >= user.level * APP_CONFIG.EXP_PER_LEVEL;
  };

  return {
    user,
    loading: isLoading,
    error: error?.message || null,
    updateUser,
    addExp,
    updateStreak,
    getExpToNextLevel,
    canLevelUp,
    isUpdating: updateUserMutation.isPending,
    isAddingExp: addExpMutation.isPending,
    isUpdatingStreak: updateStreakMutation.isPending,
  };
}
