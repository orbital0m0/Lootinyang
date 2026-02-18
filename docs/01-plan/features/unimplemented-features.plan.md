# Plan: 미구현 기능 구현 계획

## 1. 개요

| 항목 | 내용 |
|------|------|
| Feature | 미구현 기능 일괄 구현 |
| 작성일 | 2026-02-12 |
| 우선순위 | High |
| 예상 범위 | 보상 시스템, 레벨/경험치 시스템, 업적 시스템 실데이터 연동, 고양이 캐릭터 상호작용 |

## 2. 현재 구현 상태 분석

### 구현 완료 (Phase 1~3)

| 기능 | 상태 | 비고 |
|------|------|------|
| 프로젝트 기반 설정 (Vite + React + TS) | ✅ 완료 | Tailwind, TanStack Query, Framer Motion |
| Supabase 연동 및 DB 스키마 | ✅ 완료 | 8개 테이블 정의, RLS 설정 |
| 인증 시스템 | ✅ 완료 | 이메일/비밀번호, Google OAuth, 비밀번호 초기화 |
| 습관 CRUD | ✅ 완료 | 생성/수정/삭제/조회, useHabits 훅 |
| 일일 체크 시스템 | ✅ 완료 | 체크/해제, 주간 진행률, useDailyChecks 훅 |
| 고양이 캐릭터 (기본) | ✅ 완료 | CatCharacter 컴포넌트, 기본 애니메이션 |
| 라우팅 구조 | ✅ 완료 | 홈/습관/보상/프로필/업적/고양이방 |
| 하단 네비게이션 | ✅ 완료 | BottomNavigation 컴포넌트 |
| 에러 처리 | ✅ 완료 | ErrorBoundary, ErrorFallback |
| 프로필 페이지 | ✅ 완료 | ProfileHeader, LevelCard, StatisticsTab, SettingsTab |
| 고양이 방 꾸미기 | ✅ 완료 | CatRoom 페이지, 아이템 장착 UI (하드코딩 데이터) |
| 페이지 전환 애니메이션 | ✅ 완료 | Framer Motion AnimatePresence |

### 미구현 (핵심 문제 분석)

| 기능 | 상태 | 문제점 |
|------|------|--------|
| 보상 시스템 로직 | ❌ 미구현 | Rewards 페이지가 하드코딩 샘플 데이터만 사용. useRewards 훅은 Supabase 조회만 가능하고 **상자 생성/오픈 mutation이 없음** |
| 업적 시스템 연동 | ❌ 미구현 | Achievements 페이지가 하드코딩 샘플 데이터만 사용. useAchievements 훅은 있으나 **자동 달성 체크 로직이 없음** |
| 레벨/경험치 시스템 | ⚠️ 부분 구현 | useUser에 addExp, updateStreak이 있으나 **습관 체크 시 자동 경험치 부여 로직이 없음** |
| 보상 상자 생성 로직 | ❌ 미구현 | 주간 목표 달성 시 자동으로 상자를 생성하는 로직이 없음 |
| 상자 오픈 로직 | ❌ 미구현 | 상자 열기 시 랜덤 아이템 생성 및 DB 저장 로직이 없음 |
| 사용자 아이템 관리 | ❌ 미구현 | user_items 테이블과 연동하는 훅/서비스가 없음 |
| 스트릭 자동 계산 | ❌ 미구현 | 연속 체크 일수 자동 계산 및 업데이트 로직이 없음 |
| 고양이 상호작용 | ❌ 미구현 | 습관 완료 시 고양이 반응, 레벨에 따른 변화 없음 |
| 홈 대시보드 보상 카운터 | ❌ 미구현 | "보상까지 N일" 하드코딩 (daysUntilReward = 2 고정) |
| 고양이 방 실데이터 | ❌ 미구현 | CatRoom 아이템이 하드코딩, DB 연동 없음 |
| 알림/토스트 시스템 | ❌ 미구현 | 레벨업, 업적 달성, 보상 획득 시 알림이 없음 |

## 3. 구현 계획

### Phase A: 게이미피케이션 핵심 로직 (최우선)

습관 체크와 보상/경험치가 연결되는 핵심 게임 루프를 구현합니다.

#### A-1. 습관 체크 시 경험치 자동 부여
- **파일**: `src/hooks/useDailyChecks.ts`
- **내용**: checkHabit 성공 시 useUser.addExp() 호출
- **경험치 규칙**:
  - 습관 체크 1회: +10 EXP
  - 주간 목표 달성: +50 EXP 보너스
  - 연속 체크 보너스: 스트릭 * 2 EXP

#### A-2. 스트릭 자동 계산
- **파일**: `src/hooks/useStreak.ts` (신규) 또는 `useDailyChecks.ts` 확장
- **내용**:
  - 모든 활성 습관의 오늘 체크 여부 확인
  - 모든 습관 체크 완료 시 streak +1
  - 하루라도 빠지면 streak 리셋 (보호 아이템 제외)

#### A-3. 보상 상자 자동 생성
- **파일**: `src/hooks/useRewards.ts` 확장
- **내용**:
  - useRewards에 `createRewardBox`, `openRewardBox` mutation 추가
  - 주간 목표 달성 시 daily/weekly 상자 자동 생성
  - 3주 연속 성공 시 special 상자 생성

#### A-4. 상자 오픈 및 랜덤 아이템 생성
- **파일**: `src/utils/rewardLogic.ts` (신규)
- **내용**:
  - 상자 타입별 아이템 확률 테이블
  - 랜덤 아이템 선택 알고리즘
  - daily: common 70%, rare 25%, epic 5%
  - weekly: common 40%, rare 40%, epic 15%, legendary 5%
  - special: rare 30%, epic 50%, legendary 20%

#### A-5. 사용자 아이템 관리 훅
- **파일**: `src/hooks/useItems.ts` (신규)
- **내용**:
  - user_items 테이블 CRUD
  - 아이템 사용 로직 (보호막, 경험치 부스터 등)
  - 보유 아이템 조회

### Phase B: 업적 시스템 자동화

#### B-1. 업적 자동 달성 체크
- **파일**: `src/hooks/useAchievementChecker.ts` (신규)
- **내용**:
  - 습관 체크, 레벨업, 상자 오픈 등 이벤트 발생 시 업적 조건 자동 검사
  - 조건 충족 시 unlockAchievement 자동 호출
- **업적 조건 매핑**:
  - `create_habit_1`: 첫 습관 생성
  - `streak_7`: 7일 연속 체크
  - `streak_30`: 30일 연속 체크
  - `weekly_target_3`: 주간 목표 3회 달성
  - `open_box_10`: 상자 10개 오픈
  - `level_50`: 레벨 50 도달
  - `perfect_month`: 한 달 100% 달성

#### B-2. Achievements 페이지 실데이터 연동
- **파일**: `src/pages/Achievements.tsx`
- **내용**: 하드코딩된 샘플 데이터를 useAchievements 훅으로 교체

### Phase C: 보상/아이템 페이지 실데이터 연동

#### C-1. Rewards 페이지 실데이터 연동
- **파일**: `src/pages/Rewards.tsx`
- **내용**:
  - 하드코딩 샘플 데이터를 useRewards, useItems 훅으로 교체
  - 실제 상자 오픈 기능 구현
  - 상자 오픈 시 아이템 획득 모달

#### C-2. CatRoom 실데이터 연동
- **파일**: `src/pages/CatRoom.tsx`
- **내용**:
  - 하드코딩 아이템을 useItems 훅으로 교체
  - 장착 상태 DB 저장
  - 아이템 해금 조건 연동

#### C-3. 홈 대시보드 실데이터 연동
- **파일**: `src/pages/Home.tsx`
- **내용**:
  - "보상까지 N일" 실제 계산 로직
  - 오늘의 통계 표시 (완료 습관 수, 스트릭, 레벨)

### Phase D: 알림 및 피드백 시스템

#### D-1. 토스트 알림 시스템
- **파일**: `src/components/Toast.tsx` (신규), `src/hooks/useToast.ts` (신규)
- **내용**:
  - 레벨업 알림
  - 업적 달성 알림
  - 보상 상자 획득 알림
  - 주간 목표 달성 축하 알림

#### D-2. 고양이 캐릭터 상호작용
- **파일**: `src/components/CatCharacter.tsx` 확장
- **내용**:
  - 습관 체크 완료 시 기뻐하는 애니메이션
  - 스트릭에 따른 고양이 기분 변화
  - 레벨에 따른 고양이 외형 변화

## 4. 구현 우선순위 및 의존성

```
Phase A (게이미피케이션 핵심) ← 최우선, 앱의 핵심 루프
  A-1 경험치 부여
  A-2 스트릭 계산
  A-3 상자 생성 ← A-1, A-2에 의존
  A-4 상자 오픈/아이템 생성
  A-5 아이템 관리 ← A-4에 의존

Phase B (업적 자동화) ← Phase A 완료 후
  B-1 업적 자동 체크 ← A-1, A-2에 의존
  B-2 업적 페이지 연동

Phase C (페이지 실데이터) ← Phase A, B 완료 후
  C-1 보상 페이지 연동 ← A-3, A-4, A-5에 의존
  C-2 고양이방 연동 ← A-5에 의존
  C-3 홈 대시보드 연동

Phase D (알림/피드백) ← Phase A, B 완료 후
  D-1 토스트 시스템
  D-2 고양이 상호작용
```

## 5. 기술적 고려사항

### 상태 관리 전략
- 게이미피케이션 이벤트 (경험치, 업적 등)는 TanStack Query invalidation 체인으로 연쇄 업데이트
- 습관 체크 → invalidate(['currentUser']) → 레벨/경험치 갱신
- 습관 체크 → invalidate(['rewardBoxes']) → 보상 상자 갱신

### Supabase 서비스 확장
- `supabaseHelpers`에 user_items CRUD 추가 필요
- 보상 상자 생성/오픈 로직의 트랜잭션 보장 필요

### 성능 고려
- 업적 체크는 디바운스 적용 (연속 체크 시 과도한 API 호출 방지)
- 아이템 확률 계산은 클라이언트에서 처리 (서버 부하 감소)

## 6. 수정이 필요한 기존 파일

| 파일 | 수정 내용 |
|------|-----------|
| `src/hooks/useDailyChecks.ts` | 체크 시 경험치/보상 연동 |
| `src/hooks/useRewards.ts` | createRewardBox, openRewardBox mutation 추가 |
| `src/services/supabase.ts` | user_items CRUD, 보상 로직 추가 |
| `src/pages/Rewards.tsx` | 실데이터 연동으로 전환 |
| `src/pages/Achievements.tsx` | 실데이터 연동으로 전환 |
| `src/pages/Home.tsx` | 보상 카운터 실데이터 연동 |
| `src/pages/CatRoom.tsx` | 실데이터 연동 |
| `src/components/CatCharacter.tsx` | 상호작용 추가 |

## 7. 신규 파일

| 파일 | 용도 |
|------|------|
| `src/utils/rewardLogic.ts` | 아이템 확률 테이블, 랜덤 생성 로직 |
| `src/hooks/useItems.ts` | 사용자 아이템 관리 훅 |
| `src/hooks/useAchievementChecker.ts` | 업적 자동 달성 체크 |
| `src/hooks/useStreak.ts` | 스트릭 자동 계산 (선택적, useDailyChecks 통합 가능) |
| `src/hooks/useGameEvents.ts` | 게이미피케이션 이벤트 중앙 관리 |
| `src/components/Toast.tsx` | 토스트 알림 UI |
| `src/hooks/useToast.ts` | 토스트 상태 관리 |

## 8. 리스크 및 대안

| 리스크 | 영향 | 대안 |
|--------|------|------|
| Supabase DB에 user_items 테이블 미생성 | 아이템 관리 불가 | SQL migration 스크립트 제공 |
| 보상 로직 복잡도 증가 | 버그 발생 가능 | 단위별 테스트 코드 작성 |
| 경험치/레벨 밸런스 | 게임 재미 저하 | 상수 분리하여 쉽게 조정 가능하도록 |
