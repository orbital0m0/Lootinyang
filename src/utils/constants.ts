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

// ─── 보상 아이템 카탈로그 v2 ─────────────────────────────────────────────────
// 설계서 §2 기반 — 테마, 폰트 우선 구현 (Phase 1 MVP)

import type { RewardItem } from '../types';

export const REWARD_ITEMS: RewardItem[] = [
  // ── Themes — Common ────────────────────────────────────────────────────────
  {
    id: 'cream-beige',
    name: 'cream-beige',
    nameKo: '크림 베이지',
    category: 'theme',
    rarity: 'common',
    previewData: {
      '--bg-primary': '#FFF9F0',
      '--bg-secondary': '#F5EDE3',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#2D2016',
      '--text-secondary': '#8C7A6B',
      '--accent': '#D4A574',
      '--accent-light': '#F5E6D3',
      '--border': '#E8DDD0',
      '--progress-fill': '#D4A574',
    },
  },
  {
    id: 'soft-gray',
    name: 'soft-gray',
    nameKo: '소프트 그레이',
    category: 'theme',
    rarity: 'common',
    previewData: {
      '--bg-primary': '#F5F5F7',
      '--bg-secondary': '#EBEBED',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#1C1C1E',
      '--text-secondary': '#6E6E73',
      '--accent': '#636366',
      '--accent-light': '#E5E5EA',
      '--border': '#D1D1D6',
      '--progress-fill': '#636366',
    },
  },
  {
    id: 'warm-white',
    name: 'warm-white',
    nameKo: '웜 화이트',
    category: 'theme',
    rarity: 'common',
    previewData: {
      '--bg-primary': '#FFFEF9',
      '--bg-secondary': '#F9F8F0',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#1A1C1E',
      '--text-secondary': '#6B6B6B',
      '--accent': '#3E94E4',
      '--accent-light': '#EBF4FD',
      '--border': '#E8E8E8',
      '--progress-fill': '#3E94E4',
    },
  },
  {
    id: 'cloud-blue',
    name: 'cloud-blue',
    nameKo: '클라우드 블루',
    category: 'theme',
    rarity: 'common',
    previewData: {
      '--bg-primary': '#F0F6FF',
      '--bg-secondary': '#E3EDFC',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#1A2840',
      '--text-secondary': '#5B7A9D',
      '--accent': '#3E94E4',
      '--accent-light': '#D6E9FF',
      '--border': '#C8DEFF',
      '--progress-fill': '#3E94E4',
    },
  },
  // ── Themes — Rare ──────────────────────────────────────────────────────────
  {
    id: 'midnight-blue',
    name: 'midnight-blue',
    nameKo: '미드나잇 블루',
    category: 'theme',
    rarity: 'rare',
    previewData: {
      '--bg-primary': '#0D1B2A',
      '--bg-secondary': '#1B2D45',
      '--bg-card': '#1F3350',
      '--text-primary': '#E0E8F0',
      '--text-secondary': '#8BA4BE',
      '--accent': '#5B9BD5',
      '--accent-light': '#2A4A6B',
      '--border': '#2A3F5F',
      '--progress-fill': '#5B9BD5',
    },
  },
  {
    id: 'rose-gold',
    name: 'rose-gold',
    nameKo: '로즈 골드',
    category: 'theme',
    rarity: 'rare',
    previewData: {
      '--bg-primary': '#FFF5F5',
      '--bg-secondary': '#FFE8E8',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#3D1515',
      '--text-secondary': '#9B6060',
      '--accent': '#C97070',
      '--accent-light': '#FFD6D6',
      '--border': '#F5C0C0',
      '--progress-fill': '#C97070',
    },
  },
  {
    id: 'mint-forest',
    name: 'mint-forest',
    nameKo: '민트 포레스트',
    category: 'theme',
    rarity: 'rare',
    previewData: {
      '--bg-primary': '#F0FFF9',
      '--bg-secondary': '#E0F7EF',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#0D2E20',
      '--text-secondary': '#3D7A5C',
      '--accent': '#2EAA72',
      '--accent-light': '#C8F0E0',
      '--border': '#B0E8D0',
      '--progress-fill': '#2EAA72',
    },
  },
  {
    id: 'lavender-mist',
    name: 'lavender-mist',
    nameKo: '라벤더 미스트',
    category: 'theme',
    rarity: 'rare',
    previewData: {
      '--bg-primary': '#F7F0FF',
      '--bg-secondary': '#EDE0FF',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#25153D',
      '--text-secondary': '#7A5DAA',
      '--accent': '#9B6DD4',
      '--accent-light': '#E8D8FF',
      '--border': '#D8C0FF',
      '--progress-fill': '#9B6DD4',
    },
  },
  // ── Themes — Epic ──────────────────────────────────────────────────────────
  {
    id: 'aurora-gradient',
    name: 'aurora-gradient',
    nameKo: '오로라 그라데이션',
    category: 'theme',
    rarity: 'epic',
    previewData: {
      '--bg-primary': 'linear-gradient(135deg, #0D1B2A 0%, #1B2D45 50%, #2A1B45 100%)',
      '--bg-secondary': '#1B2D45',
      '--bg-card': 'rgba(31,51,80,0.8)',
      '--text-primary': '#E0F0FF',
      '--text-secondary': '#8BBBD5',
      '--accent': '#6BD4B8',
      '--accent-light': '#1A4A40',
      '--border': '#2A4060',
      '--progress-fill': 'linear-gradient(90deg, #6BD4B8, #8B6BD4)',
    },
  },
  {
    id: 'neon-city',
    name: 'neon-city',
    nameKo: '네온 시티',
    category: 'theme',
    rarity: 'epic',
    previewData: {
      '--bg-primary': '#0A0A12',
      '--bg-secondary': '#12121E',
      '--bg-card': '#1A1A2A',
      '--text-primary': '#F0F0FF',
      '--text-secondary': '#8888CC',
      '--accent': '#FF6B9D',
      '--accent-light': '#2A1A28',
      '--border': '#2A2A40',
      '--progress-fill': 'linear-gradient(90deg, #FF6B9D, #C44BFF)',
    },
  },
  {
    id: 'cat-paw-pattern',
    name: 'cat-paw-pattern',
    nameKo: '고양이 발자국',
    category: 'theme',
    rarity: 'epic',
    previewData: {
      '--bg-primary': '#FFF0F5',
      '--bg-secondary': '#FFE0EC',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#2D0015',
      '--text-secondary': '#AA4466',
      '--accent': '#FF6699',
      '--accent-light': '#FFD6E8',
      '--border': '#FFBBD4',
      '--progress-fill': '#FF6699',
    },
  },
  // ── Themes — Legendary ─────────────────────────────────────────────────────
  {
    id: 'cherry-blossom',
    name: 'cherry-blossom',
    nameKo: '벚꽃',
    category: 'theme',
    rarity: 'legendary',
    seasonId: 'spring',
    previewData: {
      '--bg-primary': '#FFF5F8',
      '--bg-secondary': '#FFE8F0',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#2D1020',
      '--text-secondary': '#AA6680',
      '--accent': '#FF80AA',
      '--accent-light': '#FFCCDD',
      '--border': '#FFBBCC',
      '--progress-fill': 'linear-gradient(90deg, #FF80AA, #FFB0CC)',
    },
  },
  {
    id: 'christmas-snow',
    name: 'christmas-snow',
    nameKo: '크리스마스 스노우',
    category: 'theme',
    rarity: 'legendary',
    seasonId: 'winter',
    previewData: {
      '--bg-primary': '#F0F8FF',
      '--bg-secondary': '#E0F0FF',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#0D2030',
      '--text-secondary': '#557799',
      '--accent': '#CC2233',
      '--accent-light': '#FFE0E0',
      '--border': '#C0DDEE',
      '--progress-fill': 'linear-gradient(90deg, #CC2233, #228833)',
    },
  },
  {
    id: 'halloween-night',
    name: 'halloween-night',
    nameKo: '할로윈 나이트',
    category: 'theme',
    rarity: 'legendary',
    seasonId: 'halloween',
    previewData: {
      '--bg-primary': '#0D0808',
      '--bg-secondary': '#1A0F0F',
      '--bg-card': '#1E1010',
      '--text-primary': '#F5E6D0',
      '--text-secondary': '#AA8866',
      '--accent': '#FF8C00',
      '--accent-light': '#2A1A00',
      '--border': '#3A2010',
      '--progress-fill': 'linear-gradient(90deg, #FF8C00, #CC44BB)',
    },
  },
  // ── Fonts ──────────────────────────────────────────────────────────────────
  {
    id: 'pretendard',
    name: 'pretendard',
    nameKo: '프리텐다드 (기본)',
    category: 'font',
    rarity: 'common',
    previewData: {
      family: 'Pretendard',
      src: '',
      sample: '습관을 만들어요',
    },
  },
  {
    id: 'maru-buri',
    name: 'maru-buri',
    nameKo: '마루부리',
    category: 'font',
    rarity: 'rare',
    previewData: {
      family: 'MaruBuri',
      src: 'https://fonts.googleapis.com/css2?family=Maru+Buri:wght@400;600&display=swap',
      sample: '습관을 만들어요',
    },
  },
  {
    id: 'galmuri',
    name: 'galmuri',
    nameKo: '갈무리',
    category: 'font',
    rarity: 'rare',
    previewData: {
      family: 'Galmuri11',
      src: '/fonts/Galmuri11.woff2',
      sample: '습관을 만들어요',
    },
  },
  {
    id: 'nanum-pen',
    name: 'nanum-pen',
    nameKo: '나눔 펜',
    category: 'font',
    rarity: 'epic',
    previewData: {
      family: 'Nanum Pen Script',
      src: 'https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap',
      sample: '습관을 만들어요',
    },
  },
  {
    id: 'nexon-gothic',
    name: 'nexon-gothic',
    nameKo: '넥슨 고딕',
    category: 'font',
    rarity: 'legendary',
    previewData: {
      family: 'NEXON Lv1 Gothic',
      src: '/fonts/NexonLv1Gothic.woff2',
      sample: '습관을 만들어요',
    },
  },
  // ── Check Animations ───────────────────────────────────────────────────────
  {
    id: 'simple-check',
    name: 'simple-check',
    nameKo: '기본 체크',
    category: 'checkAnimation',
    rarity: 'common',
    previewData: { type: 'css', className: 'check-simple' },
  },
  {
    id: 'bounce-check',
    name: 'bounce-check',
    nameKo: '바운스 체크',
    category: 'checkAnimation',
    rarity: 'rare',
    previewData: { type: 'css', className: 'check-bounce' },
  },
  // ── Progress Bars ──────────────────────────────────────────────────────────
  {
    id: 'solid-bar',
    name: 'solid-bar',
    nameKo: '기본 바',
    category: 'progressBar',
    rarity: 'common',
    previewData: { type: 'css', className: 'progress-solid' },
  },
  {
    id: 'candy-stripe',
    name: 'candy-stripe',
    nameKo: '캔디 스트라이프',
    category: 'progressBar',
    rarity: 'rare',
    previewData: { type: 'css', className: 'progress-candy' },
  },
];

// 하위 호환성을 위한 별칭
export const ITEMS_DATA = REWARD_ITEMS;

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
  getRandomItem(rarity?: string): RewardItem {
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