# 습관 CRUD 기능 문서

## 개요

Habit Cat 앱의 습관 관리 기능에 대한 상세 문서입니다. 사용자가 습관을 생성, 수정, 삭제하고 일일 체크를 관리할 수 있는 완전한 CRUD 시스템을 제공합니다.

## 기능 목록

### 1. 습관 생성 (Create)
- **위치**: `HabitsPage.tsx` - `handleCreateHabit` 함수
- **훅**: `useHabits` - `createHabit` 메서드
- **데이터베이스**: `habits` 테이블 INSERT
- **특징**:
  - 습관 이름 입력 (필수)
  - 주 목표 횟수 선택 (1-7회)
  - 실시간 유효성 검사
  - 생성 후 자동 폼 닫기

### 2. 습관 조회 (Read)
- **위치**: `HabitsPage.tsx` - 습관 목록 렌더링
- **훅**: `useHabits` - `habits` 데이터
- **특징**:
  - 사용자별 습관 목록 조회
  - TanStack Query 캐싱 (5분)
  - 실시간 데이터 동기화
  - 습관 통계 표시

### 3. 습관 수정 (Update)
- **위치**: `HabitsPage.tsx` - `handleUpdateHabit` 함수
- **훅**: `useHabits` - `updateHabit` 메서드
- **데이터베이스**: `habits` 테이블 UPDATE
- **특징**:
  - 습관 이름 수정
  - 주 목표 횟수 수정
  - 기존 데이터 유지
  - 수정 후 자동 폼 닫기

### 4. 습관 삭제 (Delete)
- **위치**: `HabitsPage.tsx` - `handleDeleteHabit` 함수
- **훅**: `useHabits` - `deleteHabit` 메서드
- **데이터베이스**: `habits` 테이블 소프트 딜리트
- **특징**:
  - 삭제 확인 다이얼로그
  - 소프트 딜리트 (is_active = false)
  - 관련 일일 체크 데이터 유지
  - 즉시 UI 반영

## 일일 체크 시스템

### 체크 기능
- **위치**: `HabitsPage.tsx` - `handleCheck` 함수
- **훅**: `useDailyChecks` - `checkHabit`, `uncheckHabit`
- **데이터베이스**: `daily_checks` 테이블 UPSERT
- **특징**:
  - 특정 날짜 체크/체크 해제
  - 중복 체크 방지 (UPSERT)
  - 실시간 진행률 업데이트

### 주간 뷰
- **기능**: 7일 주간 체크 현황 표시
- **특징**:
  - 월-일 요일 표시
  - 체크된 날짜 시각적 표시
  - 과거 날짜 비활성화
  - 클릭 가능한 날짜

### 진행률 계산
- **위치**: `HabitsPage.tsx` - `getWeeklyProgress` 함수
- **로직**: (이번 주 체크 횟수 / 주 목표 횟수) * 100
- **특징**:
  - 실시간 진행률 계산
  - 100% 초과 방지
  - 시각적 프로그레스 바

## 데이터 흐름

### 1. 습관 생성 흐름
```
사용자 입력 → 폼 제출 → handleCreateHabit → useHabits.createHabit → supabaseHelpers.createHabit → 데이터베이스 INSERT → 캐시 무효화 → UI 업데이트
```

### 2. 일일 체크 흐름
```
사용자 클릭 → handleCheck → useDailyChecks.checkHabit → supabaseHelpers.checkHabit → 데이터베이스 UPSERT → 관련 캐시 무효화 → 진행률 재계산 → UI 업데이트
```

## 상태 관리

### React 상태
- `showForm`: 생성/수정 폼 표시 여부
- `editingHabit`: 수정 중인 습관 데이터
- `newHabitName`: 새 습관 이름
- `newHabitTarget`: 새 습관 주 목표

### TanStack Query 캐시
- `['habits', userId]`: 사용자 습관 목록
- `['dailyChecks', habitId]`: 습관별 일일 체크
- `['currentUser']`: 현재 사용자 정보

## 에러 처리

### API 에러
- 네트워크 오류: 콘솔 로깅 및 사용자 알림
- 권한 오류: 자동 로그인 페이지 이동
- 데이터 유효성 오류: 폼 유효성 검사

### UI 에러
- 로딩 상태: 스피너 및 비활성화 버튼
- 빈 상태: 안내 메시지 및 생성 버튼
- 오류 상태: 에러 메시지 표시

## 최적화

### 성능 최적화
- TanStack Query 캐싱 (5분 staleTime)
- 불필요한 리렌더링 방지
- 메모이제이션된 계산 함수

### 사용자 경험
- 즉각적인 UI 피드백
- 로딩 상태 표시
- 부드러운 애니메이션 전환

## 보안

### 데이터 보호
- 사용자별 데이터 격리
- Supabase RLS 정책
- 클라이언트 측 유효성 검사

### 인증
- 로그인 상태 확인
- 자동 리디렉션
- 세션 만료 처리

## 테스트

### 수동 테스트 케이스
1. 습관 생성 테스트
2. 습관 수정 테스트
3. 습관 삭제 테스트
4. 일일 체크 테스트
5. 주간 진행률 테스트
6. 에러 상태 테스트

### 자동화 테스트 (향후 예정)
- 유닛 테스트: 훅 함수들
- 통합 테스트: 컴포넌트들
- E2E 테스트: 전체 사용자 흐름

## 향후 개선 사항

### 기능 개선
- 습관 카테고리 추가
- 습관 아이콘 선택 기능
- 습관 상세 설명 추가
- 습관 템플릿 제공

### 성능 개선
- 무한 스크롤 구현
- 오프라인 지원
- 배경 동기화
- 데이터 프리패칭

## 관련 파일

### 컴포넌트
- `src/pages/HabitsPage.tsx`: 메인 습관 관리 페이지

### 훅
- `src/hooks/useHabits.ts`: 습관 CRUD 로직
- `src/hooks/useDailyChecks.ts`: 일일 체크 로직
- `src/hooks/useUser.ts`: 사용자 정보 관리

### 서비스
- `src/services/supabase.ts`: Supabase API 호출

### 타입
- `src/types/index.ts`: TypeScript 타입 정의

## 마지막 업데이트
- 날짜: 2026-01-06
- 버전: v1.0.0
- 작성자: Habit Cat 개발팀