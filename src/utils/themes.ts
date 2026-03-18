import { getStore, setStore, STORE_KEYS } from '../services/localStore';

// 테마가 제어하는 CSS 변수 목록
export interface ThemeTokens {
  '--bg-light': string;         // 앱 배경
  '--bg-surface': string;       // 보조 서피스 (섹션 배경 등)
  '--bg-card': string;          // 카드 배경
  '--glass-bg': string;         // glass-card 배경
  '--glass-border': string;     // glass-card 테두리
  '--text-primary': string;     // 기본 텍스트
  '--text-secondary': string;   // 보조 텍스트
  '--text-muted': string;       // 흐린 텍스트
  '--primary': string;          // 주 액센트 색상
  '--primary-light': string;    // 밝은 액센트
  '--primary-dark': string;     // 어두운 액센트
  '--highlight': string;        // 강조 색상
  '--accent-light': string;     // 아주 연한 액센트 배경
  '--border-color': string;     // 테두리 색상
  '--theme-progress-fill': string; // 프로그레스 바 채움
}

export interface Theme {
  id: string;
  nameKo: string;
  isDark: boolean;
  tokens: ThemeTokens;
}

// ─── 14개 테마 정의 ───────────────────────────────────────────────────────────

export const THEMES: Record<string, Theme> = {
  'warm-white': {
    id: 'warm-white',
    nameKo: '웜 화이트',
    isDark: false,
    tokens: {
      '--bg-light': '#F0F6FF',
      '--bg-surface': '#E8F0FB',
      '--bg-card': 'rgba(255, 255, 255, 0.96)',
      '--glass-bg': 'rgba(255, 255, 255, 0.96)',
      '--glass-border': 'rgba(255, 255, 255, 0.9)',
      '--text-primary': '#1A1C1E',
      '--text-secondary': '#64748B',
      '--text-muted': '#94A3B8',
      '--primary': '#3E94E4',
      '--primary-light': '#5BA8ED',
      '--primary-dark': '#2B7ACC',
      '--highlight': '#FF4D91',
      '--accent-light': 'rgba(62, 148, 228, 0.08)',
      '--border-color': '#E2E8F0',
      '--theme-progress-fill': 'linear-gradient(90deg, #3E94E4, #FF4D91)',
    },
  },
  'cream-beige': {
    id: 'cream-beige',
    nameKo: '크림 베이지',
    isDark: false,
    tokens: {
      '--bg-light': '#FFF9F0',
      '--bg-surface': '#F5EDE3',
      '--bg-card': 'rgba(255, 255, 255, 0.95)',
      '--glass-bg': 'rgba(255, 255, 255, 0.95)',
      '--glass-border': 'rgba(255, 255, 255, 0.85)',
      '--text-primary': '#2D2016',
      '--text-secondary': '#8C7A6B',
      '--text-muted': '#B0967E',
      '--primary': '#D4A574',
      '--primary-light': '#E0BF97',
      '--primary-dark': '#B88050',
      '--highlight': '#C97A8A',
      '--accent-light': 'rgba(212, 165, 116, 0.1)',
      '--border-color': '#E8DDD0',
      '--theme-progress-fill': '#D4A574',
    },
  },
  'soft-gray': {
    id: 'soft-gray',
    nameKo: '소프트 그레이',
    isDark: false,
    tokens: {
      '--bg-light': '#F5F5F7',
      '--bg-surface': '#EBEBED',
      '--bg-card': 'rgba(255, 255, 255, 0.95)',
      '--glass-bg': 'rgba(255, 255, 255, 0.95)',
      '--glass-border': 'rgba(255, 255, 255, 0.85)',
      '--text-primary': '#1C1C1E',
      '--text-secondary': '#6E6E73',
      '--text-muted': '#AEAEB2',
      '--primary': '#636366',
      '--primary-light': '#8E8E93',
      '--primary-dark': '#48484A',
      '--highlight': '#3E94E4',
      '--accent-light': 'rgba(99, 99, 102, 0.08)',
      '--border-color': '#D1D1D6',
      '--theme-progress-fill': 'linear-gradient(90deg, #636366, #8E8E93)',
    },
  },
  'cloud-blue': {
    id: 'cloud-blue',
    nameKo: '클라우드 블루',
    isDark: false,
    tokens: {
      '--bg-light': '#F0F6FF',
      '--bg-surface': '#E3EDFC',
      '--bg-card': 'rgba(255, 255, 255, 0.96)',
      '--glass-bg': 'rgba(255, 255, 255, 0.96)',
      '--glass-border': 'rgba(255, 255, 255, 0.9)',
      '--text-primary': '#1A2840',
      '--text-secondary': '#5B7A9D',
      '--text-muted': '#8BA4BE',
      '--primary': '#3E94E4',
      '--primary-light': '#5BA8ED',
      '--primary-dark': '#2B7ACC',
      '--highlight': '#5E7FFF',
      '--accent-light': 'rgba(62, 148, 228, 0.1)',
      '--border-color': '#C8DEFF',
      '--theme-progress-fill': 'linear-gradient(90deg, #3E94E4, #5E7FFF)',
    },
  },
  'midnight-blue': {
    id: 'midnight-blue',
    nameKo: '미드나잇 블루',
    isDark: true,
    tokens: {
      '--bg-light': '#0D1B2A',
      '--bg-surface': '#1B2D45',
      '--bg-card': 'rgba(31, 51, 80, 0.95)',
      '--glass-bg': 'rgba(31, 51, 80, 0.95)',
      '--glass-border': 'rgba(62, 91, 120, 0.6)',
      '--text-primary': '#E0E8F0',
      '--text-secondary': '#8BA4BE',
      '--text-muted': '#5B7A9D',
      '--primary': '#5B9BD5',
      '--primary-light': '#7AB5E8',
      '--primary-dark': '#3B7AB0',
      '--highlight': '#7B6FFF',
      '--accent-light': 'rgba(91, 155, 213, 0.15)',
      '--border-color': '#2A3F5F',
      '--theme-progress-fill': 'linear-gradient(90deg, #5B9BD5, #7B6FFF)',
    },
  },
  'rose-gold': {
    id: 'rose-gold',
    nameKo: '로즈 골드',
    isDark: false,
    tokens: {
      '--bg-light': '#FFF5F5',
      '--bg-surface': '#FFE8E8',
      '--bg-card': 'rgba(255, 255, 255, 0.95)',
      '--glass-bg': 'rgba(255, 255, 255, 0.95)',
      '--glass-border': 'rgba(255, 255, 255, 0.85)',
      '--text-primary': '#3D1515',
      '--text-secondary': '#9B6060',
      '--text-muted': '#C08888',
      '--primary': '#C97070',
      '--primary-light': '#E09090',
      '--primary-dark': '#A05050',
      '--highlight': '#E85888',
      '--accent-light': 'rgba(201, 112, 112, 0.1)',
      '--border-color': '#F5C0C0',
      '--theme-progress-fill': 'linear-gradient(90deg, #C97070, #E85888)',
    },
  },
  'mint-forest': {
    id: 'mint-forest',
    nameKo: '민트 포레스트',
    isDark: false,
    tokens: {
      '--bg-light': '#F0FFF9',
      '--bg-surface': '#E0F7EF',
      '--bg-card': 'rgba(255, 255, 255, 0.96)',
      '--glass-bg': 'rgba(255, 255, 255, 0.96)',
      '--glass-border': 'rgba(255, 255, 255, 0.9)',
      '--text-primary': '#0D2E20',
      '--text-secondary': '#3D7A5C',
      '--text-muted': '#6BA882',
      '--primary': '#2EAA72',
      '--primary-light': '#4DC48A',
      '--primary-dark': '#1D8A58',
      '--highlight': '#00C8A0',
      '--accent-light': 'rgba(46, 170, 114, 0.1)',
      '--border-color': '#B0E8D0',
      '--theme-progress-fill': 'linear-gradient(90deg, #2EAA72, #00C8A0)',
    },
  },
  'lavender-mist': {
    id: 'lavender-mist',
    nameKo: '라벤더 미스트',
    isDark: false,
    tokens: {
      '--bg-light': '#F7F0FF',
      '--bg-surface': '#EDE0FF',
      '--bg-card': 'rgba(255, 255, 255, 0.96)',
      '--glass-bg': 'rgba(255, 255, 255, 0.96)',
      '--glass-border': 'rgba(255, 255, 255, 0.9)',
      '--text-primary': '#25153D',
      '--text-secondary': '#7A5DAA',
      '--text-muted': '#A080CC',
      '--primary': '#9B6DD4',
      '--primary-light': '#B88FE8',
      '--primary-dark': '#7A50B0',
      '--highlight': '#D46DB8',
      '--accent-light': 'rgba(155, 109, 212, 0.1)',
      '--border-color': '#D8C0FF',
      '--theme-progress-fill': 'linear-gradient(90deg, #9B6DD4, #D46DB8)',
    },
  },
  'aurora-gradient': {
    id: 'aurora-gradient',
    nameKo: '오로라 그라데이션',
    isDark: true,
    tokens: {
      '--bg-light': '#0D1B2A',
      '--bg-surface': '#1B2D45',
      '--bg-card': 'rgba(25, 40, 65, 0.9)',
      '--glass-bg': 'rgba(25, 40, 65, 0.9)',
      '--glass-border': 'rgba(80, 120, 160, 0.4)',
      '--text-primary': '#E0F0FF',
      '--text-secondary': '#8BBBD5',
      '--text-muted': '#5B8BA8',
      '--primary': '#6BD4B8',
      '--primary-light': '#90E4CC',
      '--primary-dark': '#48B898',
      '--highlight': '#8B6BD4',
      '--accent-light': 'rgba(107, 212, 184, 0.15)',
      '--border-color': '#2A4060',
      '--theme-progress-fill': 'linear-gradient(90deg, #6BD4B8, #8B6BD4)',
    },
  },
  'neon-city': {
    id: 'neon-city',
    nameKo: '네온 시티',
    isDark: true,
    tokens: {
      '--bg-light': '#0A0A12',
      '--bg-surface': '#12121E',
      '--bg-card': 'rgba(26, 26, 42, 0.95)',
      '--glass-bg': 'rgba(26, 26, 42, 0.95)',
      '--glass-border': 'rgba(80, 80, 160, 0.4)',
      '--text-primary': '#F0F0FF',
      '--text-secondary': '#8888CC',
      '--text-muted': '#5555AA',
      '--primary': '#FF6B9D',
      '--primary-light': '#FF8FB5',
      '--primary-dark': '#E84880',
      '--highlight': '#C44BFF',
      '--accent-light': 'rgba(255, 107, 157, 0.15)',
      '--border-color': '#2A2A40',
      '--theme-progress-fill': 'linear-gradient(90deg, #FF6B9D, #C44BFF)',
    },
  },
  'cat-paw-pattern': {
    id: 'cat-paw-pattern',
    nameKo: '고양이 발자국',
    isDark: false,
    tokens: {
      '--bg-light': '#FFF0F5',
      '--bg-surface': '#FFE0EC',
      '--bg-card': 'rgba(255, 255, 255, 0.96)',
      '--glass-bg': 'rgba(255, 255, 255, 0.96)',
      '--glass-border': 'rgba(255, 220, 240, 0.9)',
      '--text-primary': '#2D0015',
      '--text-secondary': '#AA4466',
      '--text-muted': '#CC6688',
      '--primary': '#FF6699',
      '--primary-light': '#FF88BB',
      '--primary-dark': '#EE4477',
      '--highlight': '#FF9944',
      '--accent-light': 'rgba(255, 102, 153, 0.1)',
      '--border-color': '#FFBBD4',
      '--theme-progress-fill': 'linear-gradient(90deg, #FF6699, #FF9944)',
    },
  },
  'cherry-blossom': {
    id: 'cherry-blossom',
    nameKo: '벚꽃',
    isDark: false,
    tokens: {
      '--bg-light': '#FFF5F8',
      '--bg-surface': '#FFE8F0',
      '--bg-card': 'rgba(255, 255, 255, 0.96)',
      '--glass-bg': 'rgba(255, 245, 250, 0.96)',
      '--glass-border': 'rgba(255, 210, 230, 0.9)',
      '--text-primary': '#2D1020',
      '--text-secondary': '#AA6680',
      '--text-muted': '#CC88A0',
      '--primary': '#FF80AA',
      '--primary-light': '#FFA0CC',
      '--primary-dark': '#EE5888',
      '--highlight': '#FF6080',
      '--accent-light': 'rgba(255, 128, 170, 0.1)',
      '--border-color': '#FFBBCC',
      '--theme-progress-fill': 'linear-gradient(90deg, #FF80AA, #FFB0CC)',
    },
  },
  'christmas-snow': {
    id: 'christmas-snow',
    nameKo: '크리스마스 스노우',
    isDark: false,
    tokens: {
      '--bg-light': '#F0F8FF',
      '--bg-surface': '#E0F0FF',
      '--bg-card': 'rgba(255, 255, 255, 0.96)',
      '--glass-bg': 'rgba(255, 255, 255, 0.96)',
      '--glass-border': 'rgba(200, 221, 238, 0.9)',
      '--text-primary': '#0D2030',
      '--text-secondary': '#557799',
      '--text-muted': '#88AACC',
      '--primary': '#CC2233',
      '--primary-light': '#EE4455',
      '--primary-dark': '#AA1122',
      '--highlight': '#228833',
      '--accent-light': 'rgba(204, 34, 51, 0.1)',
      '--border-color': '#C0DDEE',
      '--theme-progress-fill': 'linear-gradient(90deg, #CC2233, #228833)',
    },
  },
  'halloween-night': {
    id: 'halloween-night',
    nameKo: '할로윈 나이트',
    isDark: true,
    tokens: {
      '--bg-light': '#0D0808',
      '--bg-surface': '#1A0F0F',
      '--bg-card': 'rgba(30, 16, 16, 0.95)',
      '--glass-bg': 'rgba(30, 16, 16, 0.95)',
      '--glass-border': 'rgba(80, 40, 20, 0.6)',
      '--text-primary': '#F5E6D0',
      '--text-secondary': '#AA8866',
      '--text-muted': '#776655',
      '--primary': '#FF8C00',
      '--primary-light': '#FFA830',
      '--primary-dark': '#DD6A00',
      '--highlight': '#CC44BB',
      '--accent-light': 'rgba(255, 140, 0, 0.15)',
      '--border-color': '#3A2010',
      '--theme-progress-fill': 'linear-gradient(90deg, #FF8C00, #CC44BB)',
    },
  },
};

// ─── 테마 적용 함수 ───────────────────────────────────────────────────────────

export function applyTheme(themeId: string): void {
  const theme = THEMES[themeId];
  if (!theme) return;

  const root = document.documentElement;
  Object.entries(theme.tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // 다크 테마 플래그 (Tailwind 다크모드 지원)
  if (theme.isDark) {
    root.setAttribute('data-theme-mode', 'dark');
  } else {
    root.setAttribute('data-theme-mode', 'light');
  }

  setStore(STORE_KEYS.THEME, themeId);
}

// 앱 시작 시 저장된 테마 복원 (React 초기화 전 호출)
export function loadSavedTheme(): void {
  const savedThemeId = getStore<string>(STORE_KEYS.THEME, 'warm-white');
  applyTheme(savedThemeId);
}

// 특정 테마의 미리보기 색상 (가장 대표적인 accent 색상)
export function getThemePreviewColor(themeId: string): string {
  return THEMES[themeId]?.tokens['--primary'] ?? '#3E94E4';
}
