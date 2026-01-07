# Lootinyang

🐱 토스 미니앱 기반의 습관 형성 고양이 앱

## 📋 프로젝트 개요
사용자가 주 N회 습관을 설정하고 매일 체크하며 진행률을 확인하고 보상을 받는 게이미피케이션 요소를 포함한 습관 형성 앱입니다.

## 🎯 주요 기능
- 습관 생성 및 관리 (주 N회 목표 설정)
- 일일 체크 및 진행 바 시각화
- 보상 시스템 (랜덤 아이템 상자, 보호 아이템)
- 업적 시스템 (3주 연속 성공, 누적 업적, 특별 상자/뱃지)
- 고양이 캐릭터와 상호작용

## 🛠️ 기술 스택
- **Frontend**: React + TypeScript + Vite
- **상태 관리**: TanStack Query
- **스타일링**: Tailwind CSS + Framer Motion
- **백엔드**: Supabase
- **라우팅**: React Router DOM
- **플랫폼**: 토스 미니앱

## 🚀 시작하기

### 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

## 📁 프로젝트 구조
```
src/
├── components/     # 컴포넌트
├── pages/         # 페이지
├── hooks/         # 커스텀 훅
├── services/      # API 서비스
├── utils/         # 유틸리티
├── types/         # 타입 정의
└── docs/          # 문서
```

## 📖 문서
- [설계 문서](./docs/DESIGN.md)
- [TODO 리스트](./docs/TODO.md)
- [오류 로그](./docs/ERRORS.md)
- [디자인 시스템](./docs/DESIGN_SYSTEM.md)
- [습관 CRUD 기능](./docs/habit-crud.md)
- [일일 체크 시스템](./docs/daily-check-system.md)
- [인증 시스템](./docs/AUTH_SYSTEM.md)
- [Supabase 설정](./docs/SUPABASE_SETUP.md)

## ✨ 구현된 기능
- ✅ 사용자 인증 시스템 (로그인/회원가입)
- ✅ 습관 CRUD 기능 (생성/수정/삭제/조회)
- ✅ 일일 체크 시스템 (주간 뷰, 진행률 표시)
- ✅ 실시간 데이터 동기화
- ✅ 반응형 디자인 (모바일 최적화)
- ✅ TypeScript 타입 안정성
- ✅ 성능 최적화 (TanStack Query 캐싱)
- ✅ 에러 처리 및 사용자 피드백
- ✅ 디자인 시스템 (컬러, 타이포그래피, 컴포넌트)
- ✅ 고양이 캐릭터 컴포넌트 (4가지 감정 상태)
- ✅ 하단 네비게이션 구현
- ✅ Framer Motion 애니메이션 (페이지 전환, 마이크로 인터랙션)
- ✅ 보상 시스템 (RewardBox 컴포넌트, 상자 오픈 애니메이션)
- ✅ 레벨 및 경험치 시스템 (LevelProgressBar, 레벨업 애니메이션)
- ✅ 업적 시스템 (AchievementBadge, 업적 달성 애니메이션)

## 🎮 게이미피케이션
- 레벨 및 경험치 시스템
- 스트릭 보너스
- 랜덤 아이템 보상
- 업적 컬렉션
- 고양이 캐릭터 성장

## 📱 토스 미니앱
- 최대 너비: 375px
- 하단 네비게이션 지원
- 토스 UI 가이드라인 준수

## 🤝 기여
이슈 리포트와 Pull Request를 환영합니다!

## 📄 라이선스
MIT License
