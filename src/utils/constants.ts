// 앱 상수 및 설정 값

export const APP_CONFIG = {
  // 앱 기본 정보
  APP_NAME: '습관 형성 고양이',
  APP_VERSION: '1.0.0',
  
  // 토스 미니앱 설정
  TOSS_MINI_APP_MAX_WIDTH: 375,
  
  // 게임 관련 상수
  MAX_LEVEL: 100,
  EXP_PER_LEVEL: 100,
  STREAK_BONUS_MULTIPLIER: 1.5,
  
  // 습관 관련 상수
  MAX_WEEKLY_TARGET: 7,
  MIN_WEEKLY_TARGET: 1,
  DEFAULT_WEEKLY_TARGET: 3,
  
  // 보상 관련 상수
  DAILY_REWARD_EXP: 10,
  WEEKLY_REWARD_EXP: 50,
  MONTHLY_REWARD_EXP: 200,
  SPECIAL_REWARD_EXP: 500,
} as const;

// 아이템 데이터
export const ITEMS_DATA = [
  {
    id: 'cat_toy_01',
    name: '고양이 장난감',
    type: 'random' as const,
    rarity: 'common' as const,
    description: '고양이가 좋아하는 작은 장난감',
    icon: '🧸',
    effect: 'exp_bonus_5',
  },
  {
    id: 'cat_treat_01',
    name: '고양이 간식',
    type: 'random' as const,
    rarity: 'common' as const,
    description: '맛있는 고양이 간식',
    icon: '🐟',
    effect: 'exp_bonus_10',
  },
  {
    id: 'protection_shield',
    name: '하루 보호막',
    type: 'protection' as const,
    rarity: 'rare' as const,
    description: '하루 동안 습관 체크를 잊어도 괜찮아!',
    icon: '🛡️',
    effect: 'skip_penalty_protection',
  },
  {
    id: 'lucky_cat',
    name: '행운의 고양이',
    type: 'special' as const,
    rarity: 'epic' as const,
    description: '다음 보상 상자의 레어도가 올라가요',
    icon: '🐱',
    effect: 'rarity_boost',
  },
  {
    id: 'golden_cat',
    name: '황금 고양이',
    type: 'special' as const,
    rarity: 'legendary' as const,
    description: '레벨업 경험치 2배 획득!',
    icon: '🏆',
    effect: 'exp_double',
  },
];

// 업적 데이터
export const ACHIEVEMENTS_DATA = [
  {
    id: 'first_habit',
    name: '첫걸음',
    description: '첫 습관을 생성했어요',
    icon: '👶',
    condition: 'create_first_habit',
    points: 10,
    badge_color: '#10b981',
  },
  {
    id: 'week_streak',
    name: '일주일 꾸준함',
    description: '7일 연속 습관을 달성했어요',
    icon: '📅',
    condition: 'streak_7_days',
    points: 50,
    badge_color: '#3b82f6',
  },
  {
    id: 'month_streak',
    name: '한달의 달인',
    description: '30일 연속 습관을 달성했어요',
    icon: '📆',
    condition: 'streak_30_days',
    points: 200,
    badge_color: '#8b5cf6',
  },
  {
    id: 'three_weeks_master',
    name: '3주 연속 성공',
    description: '3주 연속으로 주간 목표를 달성했어요',
    icon: '🏅',
    condition: 'three_weeks_success',
    points: 150,
    badge_color: '#f59e0b',
  },
  {
    id: 'habit_collector',
    name: '습관 수집가',
    description: '5개의 습관을 생성했어요',
    icon: '📚',
    condition: 'create_5_habits',
    points: 30,
    badge_color: '#ec4899',
  },
  {
    id: 'reward_hunter',
    name: '보상 사냥꾼',
    description: '10개의 보상 상자를 열었어요',
    icon: '🎁',
    condition: 'open_10_boxes',
    points: 40,
    badge_color: '#14b8a6',
  },
  {
    id: 'legend_level',
    name: '레전드 레벨',
    description: '레벨 50에 도달했어요',
    icon: '⭐',
    condition: 'reach_level_50',
    points: 500,
    badge_color: '#f97316',
  },
  {
    id: 'perfect_month',
    name: '완벽한 한달',
    description: '한달 동안 모든 습관을 100% 달성했어요',
    icon: '💯',
    condition: 'perfect_month',
    points: 300,
    badge_color: '#ef4444',
  },
];

// 고양이 캐릭터 설정
export const CAT_CHARACTER = {
  // 기분 상태
  MOODS: {
    HAPPY: 'happy',
    NORMAL: 'normal',
    SLEEPY: 'sleepy',
    EXCITED: 'excited',
  },
  
  // 레벨에 따른 변화
  LEVEL_STYLES: {
    1: { size: 'small', accessories: [] },
    10: { size: 'medium', accessories: ['bow'] },
    25: { size: 'medium', accessories: ['bow', 'collar'] },
    50: { size: 'large', accessories: ['bow', 'collar', 'hat'] },
    75: { size: 'large', accessories: ['bow', 'collar', 'hat', 'glasses'] },
    100: { size: 'extra-large', accessories: ['bow', 'collar', 'hat', 'glasses', 'crown'] },
  },
  
  // 애니메이션 설정
  ANIMATIONS: {
    IDLE: 'bounce-slow',
    HAPPY: 'wiggle',
    SLEEPY: 'pulse',
    EXCITED: 'bounce',
  },
} as const;

// 애니메이션 설정
export const ANIMATIONS = {
  // 페이지 전환
  PAGE_TRANSITION: {
    DURATION: 300,
    EASING: 'ease-out',
  },
  
  // 버튼 효과
  BUTTON_HOVER: {
    SCALE: 1.05,
    DURATION: 200,
  },
  
  // 진행 바
  PROGRESS_BAR: {
    DURATION: 500,
    EASING: 'ease-out',
  },
  
  // 보상 상자
  REWARD_BOX: {
    OPEN_DURATION: 1000,
    SPARKLE_DURATION: 2000,
  },
  
  // 고양이 캐릭터
  CAT_CHARACTER: {
    BOUNCE_DURATION: 2000,
    WIGGLE_DURATION: 1000,
    EXCITED_DURATION: 500,
  },
} as const;

import type { Item } from '../types';

// 유틸리티 함수
export const UTILS = {
  // 경험치 계산
  calculateExpForLevel(level: number): number {
    return level * APP_CONFIG.EXP_PER_LEVEL;
  },
  
  // 다음 레벨까지 필요한 경험치
  getExpToNextLevel(currentExp: number): number {
    const currentLevel = Math.floor(currentExp / APP_CONFIG.EXP_PER_LEVEL);
    const nextLevelExp = this.calculateExpForLevel(currentLevel + 1);
    return nextLevelExp - currentExp;
  },
  
  // 주간 진행률 계산
  calculateWeeklyProgress(completedDays: number, weeklyTarget: number): number {
    return Math.min((completedDays / weeklyTarget) * 100, 100);
  },
  
  // 스트릭 보너스 계산
  calculateStreakBonus(baseExp: number, streak: number): number {
    if (streak < 7) return baseExp;
    return Math.floor(baseExp * APP_CONFIG.STREAK_BONUS_MULTIPLIER);
  },
  
  // 랜덤 아이템 선택
  getRandomItem(rarity?: string): Item {
    let availableItems = ITEMS_DATA;
    if (rarity) {
      availableItems = ITEMS_DATA.filter(item => item.rarity === rarity);
    }
    return availableItems[Math.floor(Math.random() * availableItems.length)];
  },
  
  // 날짜 포맷팅
  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },
  
  // 이번 주 시작일 계산
  getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  },
  
  // 이번 주 끝일 계산
  getWeekEnd(date: Date = new Date()): Date {
    const weekStart = this.getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return weekEnd;
  },
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  // 인증 관련
  AUTH_REQUIRED: '로그인이 필요합니다.',
  AUTH_FAILED: '로그인에 실패했습니다.',
  SIGNUP_FAILED: '회원가입에 실패했습니다.',
  
  // 습관 관련
  HABIT_CREATE_FAILED: '습관 생성에 실패했습니다.',
  HABIT_UPDATE_FAILED: '습관 수정에 실패했습니다.',
  HABIT_DELETE_FAILED: '습관 삭제에 실패했습니다.',
  HABIT_NOT_FOUND: '습관을 찾을 수 없습니다.',
  HABIT_NAME_REQUIRED: '습관 이름을 입력해주세요.',
  HABIT_TARGET_INVALID: '주 목표 횟수를 올바르게 설정해주세요.',
  
  // 체크 관련
  CHECK_FAILED: '체크 처리에 실패했습니다.',
  ALREADY_CHECKED: '이미 체크한 습관입니다.',
  
  // 보상 관련
  REWARD_OPEN_FAILED: '보상 상자 열기에 실패했습니다.',
  REWARD_ALREADY_OPENED: '이미 열린 상자입니다.',
  
  // 네트워크 관련
  NETWORK_ERROR: '네트워크 연결에 실패했습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  HABIT_CREATED: '습관이 생성되었습니다!',
  HABIT_UPDATED: '습관이 수정되었습니다!',
  HABIT_DELETED: '습관이 삭제되었습니다!',
  HABIT_CHECKED: '습관 체크 완료! 🎉',
  HABIT_UNCHECKED: '체크가 취소되었습니다.',
  REWARD_OPENED: '보상을 획득했습니다! 🎁',
  ACHIEVEMENT_UNLOCKED: '업적을 달성했습니다! 🏆',
  LEVEL_UP: '레벨업! 🎊',
} as const;

export default {
  APP_CONFIG,
  ITEMS_DATA,
  ACHIEVEMENTS_DATA,
  CAT_CHARACTER,
  ANIMATIONS,
  UTILS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};