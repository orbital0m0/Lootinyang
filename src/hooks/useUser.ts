import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, supabaseHelpers } from '../services/supabase';
import type { User, UseUserReturn } from '../types';

// 사용자 정보 관리 커스텀 훅
export function useUser(): UseUserReturn {
  const queryClient = useQueryClient();

  // 현재 사용자 정보 조회
  const {
    data: user = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const authUser = await supabaseHelpers.getCurrentUser();
        if (!authUser) return null;

        // 기본 사용자 정보 (auth 정보 기반)
        const defaultUser: User = {
          id: authUser.id,
          auth_id: authUser.id,
          username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'user',
          email: authUser.email || '',
          level: 1,
          exp: 0,
          streak: 0,
          total_habits: 0,
          created_at: authUser.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Supabase auth 사용자 정보로 DB 사용자 정보 조회 시도
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', authUser.id)
            .single();

          if (!userError && userData) {
            return userData;
          }

          // DB에 사용자 정보가 없으면 생성 시도
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              auth_id: authUser.id,
              username: defaultUser.username,
              email: defaultUser.email,
              level: 1,
              exp: 0,
              streak: 0,
              total_habits: 0,
            })
            .select()
            .single();

          if (!insertError && newUser) {
            return newUser;
          }

          // DB 오류 시에도 기본 사용자 정보 반환 (앱은 계속 동작)
          console.warn('DB 사용자 생성 실패, 기본 정보 사용:', insertError?.message);
          return defaultUser;
        } catch (dbError) {
          // DB 연결 실패 시에도 기본 사용자 정보 반환
          console.warn('DB 연결 실패, 기본 정보 사용:', dbError);
          return defaultUser;
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 10, // 10분
    retry: 1,
  });

  // 사용자 정보 업데이트
  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (!user?.id) throw new Error('사용자 정보가 없습니다.');
      return supabaseHelpers.updateUser(user.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      console.error('사용자 정보 업데이트 실패:', error);
    },
  });

  // 경험치 추가
  const addExpMutation = useMutation({
    mutationFn: async (exp: number) => {
      if (!user?.id) throw new Error('사용자 정보가 없습니다.');
      
      const newExp = user.exp + exp;
      const newLevel = Math.floor(newExp / 100) + 1;
      const maxLevel = 100;
      
      const updates = {
        exp: newExp,
        level: Math.min(newLevel, maxLevel),
      };
      
      return supabaseHelpers.updateUser(user.id, updates);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      
      // 레벨업 체크
      if (data.level > (user?.level || 1)) {
        console.log('🎉 레벨업! Level', data.level);
        // 여기에 레벨업 알림 로직 추가 가능
      }
    },
    onError: (error) => {
      console.error('경험치 추가 실패:', error);
    },
  });

  // 스트릭 업데이트
  const updateStreakMutation = useMutation({
    mutationFn: async (streak: number) => {
      if (!user?.id) throw new Error('사용자 정보가 없습니다.');
      return supabaseHelpers.updateUser(user.id, { streak });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      console.error('스트릭 업데이트 실패:', error);
    },
  });

  const updateUser = async (updates: Partial<User>) => {
    return updateUserMutation.mutateAsync(updates);
  };

  const addExp = async (exp: number) => {
    return addExpMutation.mutateAsync(exp);
  };

  const updateStreak = async (streak: number) => {
    return updateStreakMutation.mutateAsync(streak);
  };

  // 레벨업 경험치 계산
  const getExpToNextLevel = (): number => {
    if (!user) return 100;
    const currentLevel = Math.floor(user.exp / 100) + 1;
    return (currentLevel * 100) - user.exp;
  };

  // 레벨업 가능 여부
  const canLevelUp = (): boolean => {
    if (!user) return false;
    return user.exp >= user.level * 100;
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