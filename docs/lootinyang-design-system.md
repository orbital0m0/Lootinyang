# 루티냥 (Lootinyang) 디자인 시스템

> 습관 트래킹 + 상자 수집 게이미피케이션 토스 미니앱
> 
> Version 1.0 | 2024.01.13

---

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [디자인 원칙](#디자인-원칙)
3. [컬러 시스템](#컬러-시스템)
4. [타이포그래피](#타이포그래피)
5. [컴포넌트](#컴포넌트)
6. [아이콘](#아이콘)
7. [레이아웃](#레이아웃)
8. [화면 설계](#화면-설계)
9. [인터랙션 & 애니메이션](#인터랙션--애니메이션)
10. [프로토타입 플로우](#프로토타입-플로우)

---

## 프로젝트 개요

### 컨셉
- **핵심 메커니즘**: 주간 습관 달성 → 상자 획득 → 고양이 아이템 수집
- **타겟 유저**: 습관 형성에 관심 있는 MZ세대 (20-35세)
- **플랫폼**: 토스 미니앱 (iOS/Android)
- **디바이스**: iPhone 14 Pro 기준 (393 x 852)

### 핵심 기능
1. 습관 체크 및 주간 진행률 추적
2. 상자 오픈 및 아이템 수집
3. 고양이 방 꾸미기
4. 통계 및 업적 시스템

### 디자인 참고 앱
- **Duolingo**: 스트릭 강조, 데일리 목표
- **Habitica**: 게이미피케이션, 아바타
- **Neko Atsume**: 고양이 수집, 방 꾸미기
- **Toss**: 간결한 카드 UI, 숫자 애니메이션
- **Pokémon Sleep**: 수집 시스템

---

## 디자인 원칙

### 1. 친근함 (Friendly)
- 부드러운 라운드 처리 (16px border-radius)
- 따뜻한 컬러 팔레트 (크림, 오렌지)
- 귀여운 일러스트레이션 (고양이)

### 2. 명확함 (Clear)
- 직관적인 진행률 표시
- 즉각적인 피드백
- 간단한 인터랙션

### 3. 보상감 (Rewarding)
- 만족스러운 애니메이션
- 시각적 성취감
- 수집 욕구 자극

### 4. 토스 스타일 준수
- 깔끔한 카드 UI
- 숫자 강조
- 빠른 전환 (200-300ms)

---

## 컬러 시스템

### Primary Colors

```css
/* 토스 블루 계열 */
--primary-50: #EFF6FF;
--primary-100: #DBEAFE;
--primary-200: #BFDBFE;
--primary-300: #93C5FD;
--primary-400: #60A5FA;
--primary-500: #3182F6;  /* 메인 컬러 */
--primary-600: #1B64DA;
--primary-700: #1E40AF;
--primary-800: #1E3A8A;
--primary-900: #1E3A8A;
```

### Accent Colors

```css
/* 고양이 테마 */
--accent-orange-400: #FF9F43;
--accent-orange-500: #FF8C1A;

/* 따뜻한 배경 */
--accent-cream-50: #FFF4E6;
--accent-cream-100: #FFE4C4;
--accent-cream-200: #FFD4A3;
```

### Rarity Colors

```css
/* 아이템 희귀도 */
--rarity-common: #9CA3AF;    /* 회색 */
--rarity-rare: #3B82F6;      /* 파랑 */
--rarity-epic: #8B5CF6;      /* 보라 */
--rarity-legendary: #F59E0B; /* 금색 */
```

### Semantic Colors

```css
/* 상태 표시 */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Grayscale

```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

### 컬러 사용 가이드

| 용도 | 컬러 |
|------|------|
| 주요 액션 버튼 | Primary-500 |
| 배경 | White, Cream-50 |
| 텍스트 (제목) | Gray-900 |
| 텍스트 (본문) | Gray-600 |
| 텍스트 (보조) | Gray-400 |
| 구분선 | Gray-200 |
| 카드 배경 | White |
| 진행률 바 | Primary-500 |
| 스트릭 강조 | Accent-Orange-500 |

---

## 타이포그래피

### 폰트 패밀리

```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
```

**다운로드**: [Pretendard GitHub](https://github.com/orioncactus/pretendard)

### 텍스트 스타일

#### Heading

| 스타일 | 크기 | 행간 | 굵기 | 용도 |
|--------|------|------|------|------|
| H1 | 24px | 32px | Bold (700) | 페이지 타이틀, 중요 메시지 |
| H2 | 20px | 28px | Bold (700) | 섹션 타이틀 |
| H3 | 18px | 24px | SemiBold (600) | 카드 타이틀, 서브 타이틀 |

#### Body

| 스타일 | 크기 | 행간 | 굵기 | 용도 |
|--------|------|------|------|------|
| Body1 | 16px | 24px | Regular (400) | 본문, 설명 텍스트 |
| Body2 | 14px | 20px | Regular (400) | 보조 텍스트, 상세 정보 |
| Caption | 12px | 16px | Regular (400) | 라벨, 힌트 텍스트 |

#### Special

| 스타일 | 크기 | 행간 | 굵기 | 용도 |
|--------|------|------|------|------|
| Button | 16px | 24px | SemiBold (600) | 버튼 텍스트 |
| Number Large | 32px | 40px | Bold (700) | 강조 숫자 (레벨, 달성률) |
| Number Medium | 24px | 32px | SemiBold (600) | 진행률 숫자 |

### 타이포그래피 예시

```css
/* H1 */
.text-h1 {
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  color: var(--gray-900);
}

/* Body1 */
.text-body1 {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: var(--gray-600);
}

/* Button */
.text-button {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
```

---

## 컴포넌트

### 1. Button

#### Variants

**Type**: Primary, Secondary, Ghost, Danger

**Size**: Large (52px), Medium (44px), Small (36px)

**State**: Default, Hover, Pressed, Disabled

#### Specs

```css
/* Primary Large */
.button-primary-large {
  height: 52px;
  padding: 14px 20px;
  border-radius: 12px;
  background: var(--primary-500);
  color: white;
  font: var(--text-button);
  box-shadow: 0 2px 8px rgba(49, 130, 246, 0.2);
}

/* Secondary Medium */
.button-secondary-medium {
  height: 44px;
  padding: 10px 16px;
  border-radius: 10px;
  background: var(--primary-50);
  color: var(--primary-600);
  font: var(--text-button);
}

/* Ghost Small */
.button-ghost-small {
  height: 36px;
  padding: 6px 12px;
  border-radius: 8px;
  background: transparent;
  color: var(--gray-600);
  font-size: 14px;
  font-weight: 600;
}

/* States */
.button:hover {
  filter: brightness(0.95);
}

.button:active {
  transform: scale(0.95);
  transition: transform 100ms ease-in;
}

.button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

#### 사용 예시

| 용도 | Type | Size |
|------|------|------|
| 주요 액션 (상자 열기, 시작하기) | Primary | Large |
| 서브 액션 (방에 배치, 확인) | Secondary | Medium |
| 인라인 액션 (체크, 수정) | Ghost | Small |
| 위험 액션 (삭제) | Danger | Medium |

---

### 2. Habit Card

#### 구조

```
┌─────────────────────────────┐
│ [Icon] 습관 제목             │  ← Title (H3)
│                              │
│ ━━━━━━━━━━ 85%             │  ← Progress Bar
│ 6 / 7 완료                   │  ← Body2
│                              │
│ [●●●●●●○]                  │  ← Day Dots
│  월 화 수 목 금 토 일         │  ← Caption
│                              │
│                      [체크]  │  ← Button Small
└─────────────────────────────┘
```

#### Specs

```css
.habit-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.habit-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 200ms ease-out;
}

/* Title */
.habit-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 12px;
}

/* Icon */
.habit-card__icon {
  width: 24px;
  height: 24px;
  font-size: 24px;
}
```

#### States

| 상태 | 설명 | 스타일 |
|------|------|--------|
| Active | 진행 중 | border: Gray-200 |
| Completed | 주간 목표 달성 | border: Success, bg: Success-50 |
| Inactive | 비활성 | opacity: 0.6 |

---

### 3. Progress Bar

#### Specs

```css
.progress-bar {
  position: relative;
  width: 100%;
  height: 8px;
  background: var(--gray-100);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
  border-radius: 9999px;
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Sizes */
.progress-bar--small { height: 6px; }
.progress-bar--medium { height: 8px; }
.progress-bar--large { height: 12px; }
```

#### 애니메이션

```typescript
// Framer Motion 예시
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.6, ease: "easeOut" }}
/>
```

---

### 4. Day Dots

#### 구조

```
[●●●●●●○]
 월 화 수 목 금 토 일
```

#### Specs

```css
.day-dots {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.day-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* States */
.day-dot--checked {
  background: var(--primary-500);
  color: white;
}

.day-dot--unchecked {
  background: var(--gray-200);
  color: var(--gray-400);
}

.day-dot--today {
  border: 2px solid var(--primary-500);
  box-shadow: 0 0 0 2px var(--primary-100);
}
```

#### 애니메이션

```typescript
// 체크 시 bounce 효과
<motion.div
  initial={{ scale: 0.8 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 300, damping: 15 }}
/>
```

---

### 5. Tab Bar

#### 구조

```
┌─────────────────────────────┐
│   [홈]    [방]    [통계]     │
└─────────────────────────────┘
```

#### Specs

```css
.tab-bar {
  height: 80px;
  background: white;
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.tab-item__icon {
  width: 24px;
  height: 24px;
}

.tab-item__label {
  font-size: 12px;
  font-weight: 500;
}

/* States */
.tab-item--active {
  color: var(--primary-500);
}

.tab-item--inactive {
  color: var(--gray-400);
}

.tab-item:active {
  transform: scale(0.95);
}
```

---

### 6. Item Card (아이템 도감)

#### 구조

```
┌────────┐
│        │
│  [🐱]  │  ← 80x80
│        │
│  이름  │  ← Caption
│  신규  │  ← Badge
└────────┘
```

#### Specs

```css
.item-card {
  width: 100%;
  aspect-ratio: 1;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
}

.item-card__image {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.item-card__name {
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-700);
  text-align: center;
}

/* Badge */
.item-card__badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  background: var(--primary-500);
  color: white;
}

/* Rarity Borders */
.item-card--rare {
  border-color: var(--rarity-rare);
  background: linear-gradient(135deg, #EFF6FF, white);
}

.item-card--epic {
  border-color: var(--rarity-epic);
  background: linear-gradient(135deg, #F5F3FF, white);
}

.item-card--legendary {
  border-color: var(--rarity-legendary);
  background: linear-gradient(135deg, #FFFBEB, white);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}
```

---

## 아이콘

### 아이콘 시스템

**출처**: Heroicons, Lucide Icons (MIT License)

**크기**: 20px, 24px (stroke-width: 2)

**스타일**: Outline (기본), Solid (강조)

### 필수 아이콘 목록

#### Navigation

| 아이콘 | 이름 | 용도 |
|--------|------|------|
| 🏠 | Home | 홈 탭 |
| 🏡 | Room | 방 탭 |
| 📊 | Chart | 통계 탭 |
| ➕ | Plus | 추가 |
| ← | ArrowLeft | 뒤로가기 |
| ✕ | Close | 닫기 |
| ⋯ | MoreHorizontal | 더보기 메뉴 |

#### Actions

| 아이콘 | 이름 | 용도 |
|--------|------|------|
| ✓ | Check | 완료 체크 |
| ✏️ | Edit | 수정 |
| 🗑️ | Trash | 삭제 |
| 📤 | Share | 공유 |
| ⚙️ | Settings | 설정 |
| 🔔 | Bell | 알림 |

#### Status

| 아이콘 | 이름 | 용도 |
|--------|------|------|
| 🔥 | Fire | 스트릭 |
| 💎 | Diamond | 코인 |
| 🏆 | Trophy | 업적 |
| ⭐ | Star | 희귀도 |
| 🔒 | Lock | 잠금 |

#### 습관 아이콘

| 이모지 | 용도 |
|--------|------|
| 💧 | 물 마시기 |
| 🏃 | 운동 |
| 📖 | 독서 |
| 🧘 | 명상 |
| 🛌 | 수면 |
| 🥗 | 식습관 |
| 💊 | 약 복용 |
| 📝 | 일기 |
| 🎨 | 취미 |
| 🎓 | 학습 |

### 아이콘 사용 규칙

```css
/* 기본 스타일 */
.icon {
  width: 24px;
  height: 24px;
  stroke-width: 2px;
  color: currentColor;
}

/* 크기 */
.icon--small { width: 20px; height: 20px; }
.icon--medium { width: 24px; height: 24px; }
.icon--large { width: 32px; height: 32px; }

/* 컬러 */
.icon--primary { color: var(--primary-500); }
.icon--gray { color: var(--gray-400); }
.icon--success { color: var(--success); }
```

---

## 레이아웃

### 그리드 시스템

```css
/* Container */
.container {
  max-width: 393px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Spacing Scale (4px base) */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### Safe Area

```css
/* iOS Safe Area */
.screen {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Header */
.header {
  height: 64px;
  padding: 0 20px;
}

/* Tab Bar */
.tab-bar {
  height: 80px;
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 카드 레이아웃

```css
.card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-grid {
  display: grid;
  gap: 12px;
}

.card-grid--2col {
  grid-template-columns: repeat(2, 1fr);
}

.card-grid--3col {
  grid-template-columns: repeat(3, 1fr);
}
```

---

## 화면 설계

### 1. 스플래시 화면

#### 레이아웃

```
┌─────────────────────────────┐
│        Status Bar           │ ← 시스템 영역
├─────────────────────────────┤
│                             │
│                             │
│      [LOOTINYANG]          │ ← H1, Primary-600
│         루티냥              │ ← Body2, Gray-600
│                             │
│                             │
│      ┌───────────┐          │
│      │    🐱     │          │ ← 250x250
│      │  애니메이션│          │    Lottie
│      └───────────┘          │
│                             │
│                             │
│    탭하여 시작하기           │ ← Caption, Gray-400
│                             │
│                             │
└─────────────────────────────┘
```

#### 스펙

- **배경**: Cream-50 (#FFF4E6)
- **로고**: H1, Primary-600, center
- **애니메이션**: 고양이 꼬리 흔들기 (loop)
- **전환**: 3초 자동 or 탭 → 홈 화면

---

### 2. 온보딩 (3슬라이드)

#### 슬라이드 구조

```
┌─────────────────────────────┐
│                             │
│      [일러스트]              │ ← 300x300
│                             │
│                             │
│       메인 메시지            │ ← H2
│                             │
│     2-3줄 설명 텍스트        │ ← Body1
│                             │
│        ● ○ ○               │ ← Pagination
│                             │
│  [건너뛰기]        [다음]   │ ← Ghost / Primary
└─────────────────────────────┘
```

#### 콘텐츠

**슬라이드 1**: "습관 체크로 상자를 모아요"
**슬라이드 2**: "상자에서 고양이 친구를 만나요"
**슬라이드 3**: "방을 꾸미고 레벨업 하세요"

---

### 3. 홈 화면

#### 레이아웃

```
┌─────────────────────────────┐
│ ━━━ Header (64px) ━━━      │
│ [프로필]  집사 Lv.7    🔔   │
│  40x40    H3          24x24 │
│  ━━━━━━━━━━━━ 70%         │ ← Level Progress
│  🔥 7일 스트릭  💎 1,240    │
├─────────────────────────────┤
│ ━━━ Scroll Area ━━━        │
│                             │
│  이번 주 습관 (3/5 달성)     │ ← H3
│  ━━━━━━━━━━━━ 60%         │ ← Progress Large
│                             │
│ [Habit Card 1]              │
│ [Habit Card 2]              │
│ [Habit Card 3]              │
│ [+ 새 습관 추가]            │ ← Dashed Card
│                             │
├─────────────────────────────┤
│ ━━━ Tab Bar (80px) ━━━     │
│   [홈]    [방]    [통계]    │
└─────────────────────────────┘
```

#### 스펙

**Header**
- 높이: 64px
- 배경: White
- Shadow: 0 2px 8px rgba(0,0,0,0.04)
- Padding: 16px 20px

**레벨 진행률**
- Progress Bar Medium (8px)
- 퍼센트 표시: Caption, Gray-600

**주간 요약**
- 제목: H3, Gray-900
- Progress Bar Large (12px)
- Margin-bottom: 16px

**습관 카드**
- Gap: 12px
- Max: 10개 (스크롤)

---

### 4. 상자 오픈 화면

#### 오픈 전

```
Full Screen Modal
bg: rgba(0, 0, 0, 0.5)

┌─────────────────────────────┐
│         [✕ Close]           │ ← 우측 상단
│                             │
│       주간 목표 달성!        │ ← H2
│                             │
│      ┌───────────┐          │
│      │    📦     │          │ ← 250x250
│      │  반짝반짝  │          │    Lottie
│      └───────────┘          │
│                             │
│   이번 주 5개 습관 모두      │ ← Body1
│      완료했어요! 🎉         │
│                             │
│  ┌───────────────────────┐  │
│  │     상자 열기 🎁      │  │ ← Button Large
│  └───────────────────────┘  │    + Pulse
│                             │
└─────────────────────────────┘
```

#### 오픈 후

```
┌─────────────────────────────┐
│     ✨ 축하합니다! ✨       │ ← H2
│                             │
│      ┌───────────┐          │
│      │    🐱     │          │ ← 200x200
│      │  치즈냥    │          │    희귀도 배경
│      └───────────┘          │
│         ⭐⭐⭐             │
│                             │
│       치즈 고양이            │ ← H3
│    "따뜻한 성격의 냥이"      │ ← Body2
│                             │
│  희귀도: 레어                │ ← Caption
│  획득: 2024.01.13           │
│                             │
│  ┌───────────┐ ┌─────────┐ │
│  │방에 배치하기│ │  확인   │ │
│  └───────────┘ └─────────┘ │
└─────────────────────────────┘
```

#### 희귀도별 스타일

```css
/* Common */
.rarity-common {
  background: var(--gray-100);
  border: 2px solid var(--gray-400);
}

/* Rare */
.rarity-rare {
  background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
  border: 2px solid var(--rarity-rare);
}

/* Epic */
.rarity-epic {
  background: linear-gradient(135deg, #F5F3FF, #EDE9FE);
  border: 2px solid var(--rarity-epic);
}

/* Legendary */
.rarity-legendary {
  background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
  border: 2px solid var(--rarity-legendary);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
  animation: glow 2s ease-in-out infinite;
}
```

---

### 5. 고양이 방

#### 레이아웃

```
┌─────────────────────────────┐
│ ━━━ Header (56px) ━━━      │
│ [←]    냥이네 집    [편집]  │
├─────────────────────────────┤
│ ━━━ Canvas (500px) ━━━     │
│                             │
│    🌙     [배경]            │ ← 배경 레이어
│                             │
│         🐱                  │ ← 고양이
│        / \\                │
│       꾹꾹이 중...           │ ← 말풍선
│                             │
│   🪴        📦             │ ← 아이템
│        🎨                   │
│                             │
│  [━━━━━━━━ 아늑함]         │ ← 분위기 바
├─────────────────────────────┤
│ ━━━ Drawer ━━━             │
│  내 아이템 (23/150)    [▼]  │ ← 핸들
│                             │
│ [전체][고양이][가구][장식]   │ ← Filter Tabs
│                             │
│ ┌────┐ ┌────┐ ┌────┐       │ ← 3열 Grid
│ │ 🐱 │ │ 🪴 │ │ 🎨 │       │
│ │신규│ │레어│ │    │       │
│ └────┘ └────┘ └────┘       │
│                             │
└─────────────────────────────┘
```

#### 인터랙션

1. **고양이 터치**
   - 5가지 랜덤 리액션
   - 효과음 재생
   - Haptic feedback

2. **아이템 드래그**
   - 롱프레스 → 편집 모드
   - 그리드 스냅
   - 겹침 방지

3. **배경 변경**
   - 낮/밤/계절 테마
   - 획득 조건: 특정 업적

4. **스크린샷**
   - 우측 상단 📷 버튼
   - PNG 생성
   - 토스 공유 기능

---

### 6. 통계 화면

#### 레이아웃

```
┌─────────────────────────────┐
│ ━━━ Header ━━━             │
│ [←]      통계      [공유]   │
├─────────────────────────────┤
│ ━━━ Scroll Area ━━━        │
│                             │
│  ━━━ 이번 달 ━━━           │
│                             │
│  ┌─────────────────────┐   │ ← Summary Card
│  │   달성률 85% 🎉      │   │   Gradient bg
│  │  ━━━━━━━━━━━━━━━  │   │
│  │   [원형 차트]        │   │
│  │   3주 / 4주 성공     │   │
│  │   전월 대비 +15% ↗️  │   │
│  └─────────────────────┘   │
│                             │
│  주차별 상세                │
│                             │
│  [1주] ✓ 100% 🏆           │
│  [2주] ✓  90% 🥈           │
│  [3주] ✓  95% 🥇           │
│  [4주]    60% ⏳           │
│                             │
│  ━━━ 전체 기록 ━━━         │
│                             │
│  [총 달성] [스트릭] [가입일] │ ← 3열 Grid
│   142개     23일    127일   │
│                             │
│  ━━━ 습관별 상세 ━━━       │
│                             │
│  💧 물 마시기   [상세→]    │
│  ┌─────────────────────┐   │
│  │  [미니 차트]         │   │ ← Recharts
│  │   ▅▆█▇▅▆█         │   │
│  └─────────────────────┘   │
│  92% 달성  |  18주 연속     │
│                             │
│  🏃 운동       [상세→]     │
│  78% 달성  |   9주 연속     │
│                             │
└─────────────────────────────┘
```

#### 차트 컴포넌트

```typescript
// Recharts 설정
<LineChart data={weeklyData}>
  <Line 
    type="monotone" 
    dataKey="percentage" 
    stroke="#3182F6"
    strokeWidth={2}
  />
  <XAxis dataKey="week" />
  <YAxis domain={[0, 100]} />
</LineChart>
```

---

### 7. 습관 상세 화면

#### 레이아웃

```
┌─────────────────────────────┐
│ [←]  물 8잔 마시기  [⋮]     │
├─────────────────────────────┤
│                             │
│  이번 주 진행률              │
│  ━━━━━━━━━━━━ 85%         │
│  6 / 7 완료                 │
│                             │
│  [월][화][수][목][금][토][일]│
│   ●  ●  ●  ●  ●  ●  ○    │
│                             │
│ ━━━ 지난 4주 ━━━           │
│                             │
│  4주 전  ●●●●●○○  5/7     │
│  3주 전  ●●●●●●●  7/7 ✓   │
│  2주 전  ●●●●●●○  6/7     │
│  지난 주  ●●●●●●●  7/7 ✓   │
│                             │
│ ━━━ 통계 ━━━              │
│                             │
│  총 달성      47회          │
│  최장 스트릭  12주           │
│  평균 달성률  89%           │
│                             │
│  [수정]         [삭제]      │
└─────────────────────────────┘
```

#### 우측 상단 [⋮] 메뉴

- 알림 설정
- 목표 수정 (주 N회)
- 아이콘 변경
- 기록 초기화

---

## 인터랙션 & 애니메이션

### Transition Specs

```typescript
// 기본 전환
const transition = {
  duration: 300,
  ease: [0.4, 0, 0.2, 1] // ease-in-out
};

// 페이지 전환 (Slide)
const pageTransition = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { duration: 300, ease: 'easeInOut' }
};

// 모달 등장 (Scale + Fade)
const modalTransition = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 250, ease: 'easeOut' }
};

// 버튼 Press
const buttonPress = {
  scale: 0.95,
  transition: { duration: 100, ease: 'easeIn' }
};
```

---

### Micro-interactions

#### 1. 습관 체크

```typescript
// 애니메이션 시퀀스
1. Button tap → scale(0.95) + haptic
2. API 성공 → 
   - 체크마크 Lottie (0.5s)
   - 진행률 바 증가 (0.6s)
   - 요일 점 변화 (0.3s)
3. 주간 목표 달성 시 →
   - 축하 파티클 (1s)
   - "상자 준비됨" 배지
```

#### 2. 진행률 바

```typescript
// 숫자 카운트 애니메이션
<CountUp
  start={0}
  end={progress}
  duration={0.6}
  suffix="%"
/>

// 바 채우기
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.6, ease: "easeOut" }}
/>
```

#### 3. 상자 오픈 시퀀스

```typescript
// 총 1.5초
const boxOpenSequence = async () => {
  // Phase 1: 흔들림 (300ms)
  await animate('.box', { rotate: [-5, 5, -5, 5, 0] });
  
  // Phase 2: 폭발 (200ms)
  await animate('.box', { scale: 1.2, opacity: 0 });
  playParticles();
  
  // Phase 3: 아이템 등장 (500ms)
  await animate('.item', { 
    scale: [0, 1.1, 1],
    opacity: [0, 1]
  });
  
  // Phase 4: 정보 표시 (500ms)
  await animate('.info', { 
    y: [20, 0],
    opacity: [0, 1]
  });
};
```

#### 4. 고양이 리액션

```typescript
const catReactions = [
  { name: '야옹', animation: 'meow', sound: 'meow.mp3' },
  { name: '점프', animation: 'jump', sound: 'jump.mp3' },
  { name: '꾹꾹이', animation: 'knead', sound: 'purr.mp3' },
  { name: '그루밍', animation: 'groom', sound: null },
  { name: '윙크', animation: 'wink', sound: 'wink.mp3' }
];

// 랜덤 선택
const randomReaction = catReactions[Math.floor(Math.random() * 5)];
```

#### 5. 스와이프 액션

```typescript
// 임계값: 50px
const threshold = 50;

// 좌측 스와이프 (수정)
if (deltaX < -threshold) {
  showEditButton();
  cardBackground = 'blue';
}

// 우측 스와이프 (삭제)
if (deltaX > threshold) {
  showDeleteButton();
  cardBackground = 'red';
}
```

---

### Haptic Feedback

```typescript
// iOS/Android 햅틱
const haptic = {
  light: () => navigator.vibrate(10),
  medium: () => navigator.vibrate([10, 5, 10]),
  heavy: () => navigator.vibrate([15, 10, 15]),
  success: () => navigator.vibrate([10, 5, 10, 5, 10])
};

// 사용 예시
onClick={() => {
  haptic.light();
  checkHabit();
}}
```

---

### Loading States

```typescript
// Skeleton Screen
<div className="skeleton">
  <div className="skeleton-line" />
  <div className="skeleton-line" />
  <div className="skeleton-circle" />
</div>

// Spinner
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
>
  ⏳
</motion.div>
```

---

## 프로토타입 플로우

### User Flow

```
[스플래시] (3초 or 탭)
   ↓
[온보딩 1] → [온보딩 2] → [온보딩 3]
   ↓ (시작하기)
[홈 화면] ←→ [방] ←→ [통계]  (탭바)
   ↓
[습관 체크] → (주간 달성 시)
   ↓
[상자 오픈 모달]
   ↓
[아이템 획득]
   ↓ (방에 배치)
[방 - 편집 모드]
```

### Figma Prototype 설정

#### 1. 기본 전환

```
Trigger: On Tap
Action: Navigate to
Animation: Move In (Left)
Duration: 300ms
Easing: Ease In Out
```

#### 2. 모달

```
Trigger: On Tap
Action: Open Overlay
Position: Center
Animation: Dissolve
Duration: 250ms
Close when tapping outside: Yes
```

#### 3. 탭바

```
Trigger: On Tap
Action: Change to
Animation: Smart Animate
Duration: 200ms
```

#### 4. 스와이프

```
Trigger: On Drag
Direction: Horizontal
Action: Navigate to
Animation: Move In (Right)
```

---

## 개발 핸드오프

### 파일 구조

```
design-handoff/
├── colors.css          # CSS 변수
├── typography.css      # 폰트 스타일
├── components/         # 컴포넌트별 스펙
│   ├── button.md
│   ├── habit-card.md
│   └── progress-bar.md
├── screens/            # 화면별 상세
│   ├── home.md
│   ├── box-opening.md
│   └── cat-room.md
├── assets/
│   ├── icons/          # SVG 아이콘
│   ├── images/         # PNG/JPG
│   │   ├── @1x/
│   │   ├── @2x/
│   │   └── @3x/
│   └── lottie/         # Lottie JSON
└── prototype.fig       # Figma 파일
```

### Inspect Mode

Figma에서 각 요소 선택 시 확인:

- **위치**: X, Y 좌표
- **크기**: Width, Height
- **여백**: Padding, Margin
- **컬러**: Hex, RGB
- **폰트**: Family, Size, Weight, Line height
- **효과**: Shadow, Border, Opacity

---

## 버전 히스토리

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| 1.0 | 2024.01.13 | 초기 디자인 시스템 완성 |

---

## 참고 자료

### 디자인 도구
- Figma: https://figma.com
- Pretendard Font: https://github.com/orioncactus/pretendard
- Heroicons: https://heroicons.com
- Lucide Icons: https://lucide.dev

### 개발 라이브러리
- Framer Motion: https://www.framer.com/motion/
- Lottie: https://airbnb.io/lottie/
- Recharts: https://recharts.org/
- Tailwind CSS: https://tailwindcss.com

### 참고 앱
- Duolingo: 습관 형성 UX
- Habitica: 게이미피케이션
- Neko Atsume: 수집 시스템
- Toss: 금융 앱 UX

---

**문의**: [개발팀 이메일]

**마지막 업데이트**: 2024.01.13
