# 🎨 디자인 시스템 및 UI 가이드라인

## 🎯 디자인 철학
**"귀여운 고양이와 함께하는 즐거운 습관 형성"**
- 친근하고 귀여운 비주얼
- 직관적이고 사용하기 쉬운 인터페이스
- 게이미피케이션 요소로 동기 부여
- 깔끔하고 현대적인 미니멀리즘

---

## 🎨 컬러 시스템

### 주요 컬러 (Primary Colors)
```css
/* 핑크 계열 - 메인 브랜드 컬러 */
--primary-50: #fff1f2;
--primary-100: #ffe4e6;
--primary-200: #fecdd3;
--primary-300: #fda4af;
--primary-400: #fb7185;
--primary-500: #f43f5e; /* 메인 컬러 */
--primary-600: #e11d48;
--primary-700: #be123c;
--primary-800: #9f1239;
--primary-900: #881337;
```

### 고양이 테마 컬러 (Cat Theme)
```css
/* 고양이 오렌지 - 보조 컬러 */
--cat-orange: #ff8c42;
--cat-orange-light: #ffb380;
--cat-orange-dark: #e67a36;

/* 고양이 핑크 - 귀여움 강조 */
--cat-pink: #ffc0cb;
--cat-pink-light: #ffd0dc;
--cat-pink-dark: #ffb0c0;

/* 고양이 보라 - 특별한 순간 */
--cat-purple: #b19cd9;
--cat-purple-light: #c8b6e6;
--cat-purple-dark: #9b84c6;
```

### 중성 컬러 (Neutral Colors)
```css
/* 회색 계열 */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* 배경 및 서피스 */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;
--surface: #ffffff;
--surface-hover: #f9fafb;
```

### 상태 컬러 (Status Colors)
```css
/* 성공 */
--success-50: #ecfdf5;
--success-500: #10b981;
--success-600: #059669;

/* 경고 */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* 에러 */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

/* 정보 */
--info-50: #eff6ff;
--info-500: #3b82f6;
--info-600: #2563eb;
```

---

## 📝 타이포그래피

### 폰트 계층
```css
/* Inter 폰트 기반 */
.font-display {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
}

.font-heading {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}

.font-body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

.font-caption {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}
```

### 폰트 크기
```css
/* 디스플레이 */
.text-display-xl { font-size: 2.5rem; line-height: 1.2; } /* 40px */
.text-display-lg { font-size: 2rem; line-height: 1.2; }  /* 32px */
.text-display-md { font-size: 1.75rem; line-height: 1.3; } /* 28px */

/* 헤딩 */
.text-heading-xl { font-size: 1.5rem; line-height: 1.3; } /* 24px */
.text-heading-lg { font-size: 1.25rem; line-height: 1.4; } /* 20px */
.text-heading-md { font-size: 1.125rem; line-height: 1.4; } /* 18px */
.text-heading-sm { font-size: 1rem; line-height: 1.5; } /* 16px */

/* 본문 */
.text-body-lg { font-size: 1rem; line-height: 1.6; } /* 16px */
.text-body-md { font-size: 0.875rem; line-height: 1.6; } /* 14px */
.text-body-sm { font-size: 0.75rem; line-height: 1.5; } /* 12px */

/* 캡션 */
.text-caption-md { font-size: 0.75rem; line-height: 1.4; } /* 12px */
.text-caption-sm { font-size: 0.625rem; line-height: 1.4; } /* 10px */
```

---

## 🎯 컴포넌트 디자인

### 버튼 (Buttons)
```css
/* 프라이머리 버튼 */
.btn-primary {
  @apply bg-primary-500 hover:bg-primary-600 active:bg-primary-700;
  @apply text-white font-semibold;
  @apply py-3 px-6 rounded-xl;
  @apply transition-all duration-200;
  @apply shadow-sm hover:shadow-md;
  @apply transform hover:scale-105 active:scale-95;
}

/* 세컨더리 버튼 */
.btn-secondary {
  @apply bg-white hover:bg-gray-50 border-2 border-primary-500;
  @apply text-primary-500 font-semibold;
  @apply py-3 px-6 rounded-xl;
  @apply transition-all duration-200;
}

/* 고양이 테마 버튼 */
.btn-cat {
  @apply bg-cat-orange hover:bg-cat-orange-dark;
  @apply text-white font-bold;
  @apply py-3 px-6 rounded-full;
  @apply transition-all duration-200;
  @apply transform hover:scale-110 active:scale-95;
}

/* 아이콘 버튼 */
.btn-icon {
  @apply p-3 rounded-full;
  @apply transition-all duration-200;
  @apply hover:bg-gray-100;
  @apply transform hover:scale-110 active:scale-95;
}
```

### 카드 (Cards)
```css
/* 기본 카드 */
.card {
  @apply bg-white rounded-2xl;
  @apply shadow-sm border border-gray-100;
  @apply p-6;
  @apply transition-all duration-200;
}

.card:hover {
  @apply shadow-md transform -translate-y-1;
}

/* 습관 카드 */
.card-habit {
  @apply bg-gradient-to-br from-primary-50 to-pink-50;
  @apply border-2 border-primary-200;
  @apply p-5;
}

/* 보상 카드 */
.card-reward {
  @apply bg-gradient-to-br from-cat-purple to-cat-pink;
  @apply text-white;
  @apply p-6;
  @apply shadow-lg;
}

/* 업적 카드 */
.card-achievement {
  @apply bg-gradient-to-br from-amber-50 to-orange-50;
  @apply border-2 border-amber-200;
  @apply p-4;
}
```

### 진행 바 (Progress Bars)
```css
/* 기본 진행 바 */
.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-3;
  @apply overflow-hidden;
  @apply shadow-inner;
}

.progress-fill {
  @apply bg-gradient-to-r from-primary-400 to-primary-500;
  @apply h-full rounded-full;
  @apply transition-all duration-500 ease-out;
  @apply shadow-sm;
}

/* 고양이 테마 진행 바 */
.progress-bar-cat {
  @apply bg-gradient-to-r from-cat-orange-light to-cat-pink-light;
}

.progress-fill-cat {
  @apply bg-gradient-to-r from-cat-orange to-cat-pink;
  @apply relative;
}

.progress-fill-cat::after {
  content: '🐱';
  @apply absolute right-0 top-1/2 transform -translate-y-1/2;
  @apply text-xs;
  @apply animate-bounce-slow;
}
```

---

## 🐱 고양이 캐릭터 디자인

### 기본 고양이
```css
/* 고양이 얼굴 */
.cat-face {
  @apply relative;
  @apply w-24 h-24;
  @apply bg-gradient-to-br from-cat-orange to-cat-orange-dark;
  @apply rounded-full;
  @apply shadow-lg;
}

/* 고양이 귀 */
.cat-ear {
  @apply absolute w-8 h-8;
  @apply bg-cat-orange;
  @apply rounded-t-full;
  @apply transform rotate-45;
}

.cat-ear.left {
  @apply -top-3 -left-2;
  @apply transform -rotate-12;
}

.cat-ear.right {
  @apply -top-3 -right-2;
  @apply transform rotate-12;
}

/* 고양이 눈 */
.cat-eye {
  @apply absolute w-3 h-4;
  @apply bg-gray-800;
  @apply rounded-full;
  @apply top-8;
}

.cat-eye.left { @apply left-6; }
.cat-eye.right { @apply right-6; }

/* 고양이 코 */
.cat-nose {
  @apply absolute w-2 h-2;
  @apply bg-pink-400;
  @apply rounded-full;
  @apply top-12 left-1/2 transform -translate-x-1/2;
}

/* 고양이 입 */
.cat-mouth {
  @apply absolute w-4 h-2;
  @apply border-b-2 border-gray-800;
  @apply rounded-b-full;
  @apply top-14 left-1/2 transform -translate-x-1/2;
}
```

### 고양이 애니메이션
```css
/* 깡충깡충 */
@keyframes bounce-cat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

.cat-bounce {
  animation: bounce-cat 2s ease-in-out infinite;
}

/* 꼬리 흔들기 */
@keyframes wiggle-tail {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

.cat-tail-wiggle {
  animation: wiggle-tail 1s ease-in-out infinite;
  transform-origin: bottom center;
}

/* 행복한 고양이 */
.cat-happy {
  @apply animate-bounce-slow;
}

.cat-eye.happy .cat-pupil {
  @apply transform scale-110;
}
```

---

## 🎭 아이콘 및 일러스트

### 아이콘 시스템
- **Heroicons**: 기본 UI 아이콘
- **커스텀 고양이 아이콘**: SVG 기반 제작
- **업적 아이콘**: 뱃지 스타일 디자인
- **아이템 아이콘**: 귀여운 고양이 관련 아이템

### 아이콘 크기
```css
.icon-xs { width: 12px; height: 12px; }
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }
.icon-2xl { width: 48px; height: 48px; }
.icon-3xl { width: 64px; height: 64px; }
```

---

## 📱 모바일 레이아웃 (토스 미니앱)

### 뷰포트 제약
```css
/* 토스 미니앱 최대 너비 */
.mini-app-container {
  max-width: 375px;
  margin: 0 auto;
  min-height: 100vh;
  @apply bg-gray-50;
}

/* 세이프 에어리어 */
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### 하단 네비게이션
```css
.bottom-nav {
  @apply fixed bottom-0 left-0 right-0;
  @apply bg-white border-t border-gray-200;
  @apply max-w-[375px] mx-auto;
  @apply px-4 py-2;
  @apply safe-area;
}

.nav-item {
  @apply flex flex-col items-center;
  @apply py-2 px-3;
  @apply rounded-lg;
  @apply transition-colors duration-200;
}

.nav-item.active {
  @apply bg-primary-50 text-primary-500;
}

.nav-item:not(.active) {
  @apply text-gray-500 hover:bg-gray-50;
}
```

---

## ✨ 애니메이션 및 효과

### 페이지 전환
```css
/* 페이드 인 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-enter {
  animation: fade-in 0.3s ease-out;
}

/* 슬라이드 업 */
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-enter {
  animation: slide-up 0.3s ease-out;
}
```

### 마이크로 인터랙션
```css
/* 버튼 호버 */
.btn-hover {
  @apply transition-all duration-200;
  @apply transform hover:scale-105 active:scale-95;
}

/* 카드 호버 */
.card-hover {
  @apply transition-all duration-300;
  @apply hover:shadow-lg hover:-translate-y-1;
}

/* 링크 호버 */
.link-hover {
  @apply transition-colors duration-200;
  @apply hover:text-primary-500;
  @apply relative;
}

.link-hover::after {
  content: '';
  @apply absolute bottom-0 left-0;
  @apply w-0 h-0.5 bg-primary-500;
  @apply transition-all duration-200;
}

.link-hover:hover::after {
  @apply w-full;
}
```

### 특수 효과
```css
/* 반짝임 효과 */
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

.sparkle {
  animation: sparkle 1s ease-in-out;
}

/* 입자 효과 */
.particle {
  @apply absolute w-2 h-2 bg-primary-400 rounded-full;
  @apply pointer-events-none;
  @apply animate-ping;
}

/* 성공 체크마크 */
.success-check {
  @apply w-8 h-8 text-green-500;
  @apply animate-bounce;
}
```

---

## 🎪 테마 및 시각적 효과

### 다크 모드 (선택적)
```css
.dark {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --surface: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
}
```

### 계절 테마 (선택적)
```css
/* 봄 테마 */
.theme-spring {
  --primary-500: #ec4899;
  --accent: #84cc16;
}

/* 여름 테마 */
.theme-summer {
  --primary-500: #06b6d4;
  --accent: #f59e0b;
}

/* 가을 테마 */
.theme-autumn {
  --primary-500: #f97316;
  --accent: #a855f7;
}

/* 겨울 테마 */
.theme-winter {
  --primary-500: #3b82f6;
  --accent: #e11d48;
}
```

---

## 📐 스페이싱 및 그리드

### 스페이싱 스케일
```css
/* 4px 기반 스케일 */
.space-1 { margin: 0.25rem; } /* 4px */
.space-2 { margin: 0.5rem; }  /* 8px */
.space-3 { margin: 0.75rem; } /* 12px */
.space-4 { margin: 1rem; }    /* 16px */
.space-5 { margin: 1.25rem; } /* 20px */
.space-6 { margin: 1.5rem; }  /* 24px */
.space-8 { margin: 2rem; }    /* 32px */
.space-10 { margin: 2.5rem; } /* 40px */
.space-12 { margin: 3rem; }   /* 48px */
```

### 그리드 시스템
```css
/* 12컬럼 그리드 */
.grid {
  @apply grid grid-cols-12 gap-4;
}

.col-1 { @apply col-span-1; }
.col-2 { @apply col-span-2; }
.col-3 { @apply col-span-3; }
.col-4 { @apply col-span-4; }
.col-6 { @apply col-span-6; }
.col-8 { @apply col-span-8; }
.col-12 { @apply col-span-12; }
```

---

## 🎯 접근성 (Accessibility)

### 포커스 상태
```css
.focus-visible {
  @apply outline-none;
  @apply ring-2 ring-primary-500 ring-offset-2;
  @apply rounded-lg;
}

.focus-visible:focus {
  @apply outline-none;
  @apply ring-2 ring-primary-500 ring-offset-2;
}
```

### 색상 대비
- 모든 텍스트는 WCAG 2.1 AA 표준 준수
- 주요 컨텐츠: 4.5:1 이상 대비
- 큰 텍스트: 3:1 이상 대비

### 터치 타겟
- 최소 터치 타겟: 44px × 44px
- 버튼 및 인터랙티브 요소 적용

---

## 🔄 디자인 구현 체크리스트

### 컬러
- [ ] 브랜드 컬러 적용
- [ ] 상태 컬러 정의
- [ ] 대비율 검증
- [ ] 다크 모드 지원 (선택)

### 타이포그래피
- [ ] 폰트 계층 설정
- [ ] 가독성 확보
- [ ] 반응형 폰트 크기
- [ ] 라인 높이 최적화

### 컴포넌트
- [ ] 버튼 디자인 일관성
- [ ] 카드 그림자 및 테두리
- [ ] 진행 바 애니메이션
- [ ] 폼 요소 스타일링

### 애니메이션
- [ ] 자연스러운 전환 효과
- [ ] 로딩 상태 표시
- [ ] 성공/실패 피드백
- [ ] 고양이 캐릭터 애니메이션

### 모바일 최적화
- [ ] 375px 너비 제약 준수
- [ ] 터치 타겟 크기
- [ ] 세이프 에어리어 처리
- [ ] 하단 네비게이션 구현