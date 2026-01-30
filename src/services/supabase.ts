import { createClient } from '@supabase/supabase-js';
import type { User, Habit, RewardBox, Item } from '../types';

// Supabase 설정 - 실제 프로젝트 값으로 교체 필요
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase 헬퍼 함수들
export const supabaseHelpers = {
  // 사용자 관련
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async resetPasswordForEmail(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  },

  // 습관 관련
  async getHabits(userId: string) {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createHabit(habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('habits')
      .insert(habit)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateHabit(id: string, updates: Partial<Habit>) {
    const { data, error } = await supabase
      .from('habits')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteHabit(id: string) {
    const { error } = await supabase
      .from('habits')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  // 일일 체크 관련
  async getDailyChecks(habitId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('daily_checks')
      .select('*')
      .eq('habit_id', habitId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // 사용자의 모든 습관에 대한 일일 체크 조회
  async getDailyChecksByUser(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('daily_checks')
      .select('*, habits!inner(user_id)')
      .eq('habits.user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async checkHabit(habitId: string, date: string) {
    const { data, error } = await supabase
      .from('daily_checks')
      .upsert({
        habit_id: habitId,
        date,
        completed: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'habit_id,date',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async uncheckHabit(habitId: string, date: string) {
    const { data, error } = await supabase
      .from('daily_checks')
      .update({ completed: false, updated_at: new Date().toISOString() })
      .eq('habit_id', habitId)
      .eq('date', date)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 아이템 관련
  async getItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // 보상 상자 관련
  async getRewardBoxes(userId: string) {
    const { data, error } = await supabase
      .from('reward_boxes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createRewardBox(rewardBox: Omit<RewardBox, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('reward_boxes')
      .insert({ ...rewardBox, created_at: new Date().toISOString() })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async openRewardBox(boxId: string, items: Item[]) {
    const { data, error } = await supabase
      .from('reward_boxes')
      .update({
        is_opened: true,
        items,
        opened_at: new Date().toISOString(),
      })
      .eq('id', boxId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 업적 관련
  async getAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('points', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements(*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async unlockAchievement(userId: string, achievementId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 사용자 정보 업데이트
  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// 실시-time 구독을 위한 함수들
export const supabaseSubscriptions = {
  subscribeToHabits(userId: string, callback: (payload: unknown) => void) {
    return supabase
      .channel('habits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habits',
          filter: `user_id=eq.${userId}`,
        } as const,
        callback
      )
      .subscribe();
  },

  subscribeToDailyChecks(habitId: string, callback: (payload: unknown) => void) {
    return supabase
      .channel('daily_checks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_checks',
          filter: `habit_id=eq.${habitId}`,
        } as const,
        callback
      )
      .subscribe();
  },
};

export default supabase;