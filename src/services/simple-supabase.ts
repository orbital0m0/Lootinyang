// 간단화된 Supabase 헬퍼 - 타입 오류 방지
import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 단순화된 인증 헬퍼
export const simpleSupabase = {
  // 현재 사용자 조회
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // 로그인
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // 회원가입
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

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

// 기본 헬퍼 (향후 확장용)
export const supabaseHelpers = {
  // 습관 관련 (향후 구현)
  async getHabits(userId: string) {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 일일 체크 관련 (향후 구현)
  async getDailyChecks(habitId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('daily_checks')
      .select('*')
      .eq('habit_id', habitId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // 보상 상자 관련 (향후 구현)
  async getRewardBoxes(userId: string) {
    const { data, error } = await supabase
      .from('reward_boxes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 업적 관련 (향후 구현)
  async getAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('points', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // 사용자 업적 관련 (향후 구현)
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
    return data || [];
  },

  // 업적 달성 (향후 구현)
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
};

export default supabase;