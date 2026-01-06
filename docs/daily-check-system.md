# 일일 체크 시스템 문서

## 개요

Habit Cat 앱의 일일 체크 시스템에 대한 상세 문서입니다. 사용자가 매일 습관을 체크하고 주간 진행률을 추적할 수 있는 완전한 체크 관리 시스템을 제공합니다.

## 기능 목록

### 1. 일일 체크 (Daily Check)
- **위치**: `HabitsPage.tsx` - 체크 버튼 및 주간 뷰
- **훅**: `useDailyChecks` - `checkHabit`, `uncheckHabit`
- **데이터베이스**: `daily_checks` 테이블 UPSERT
- **특징**:
  - 당일 체크/체크 해제 기능
  - 중복 체크 방지 (UPSERT 방식)
  - 실시간 진행률 업데이트
  - 즉각적인 UI 반영

### 2. 주간 뷰 (Weekly View)
- **위치**: `HabitsPage.tsx` - 주간 체크박스 그리드
- **기능**: 7일 주간 체크 현황 시각화
- **특징**:
  - 월-일 요일 표시
  - 체크된 날짜 시각적 구분
  - 과거 날짜 비활성화 처리
  - 클릭 가능한 날짜 인터랙션

### 3. 진행률 계산 (Progress Calculation)
- **위치**: `useDailyChecks.ts` - `getWeeklyProgress` 함수
- **로직**: (이번 주 체크 횟수 / 주 목표 횟수) × 100
- **특징**:
  - 실시간 진행률 계산
  - 100% 초과 방지
  - 시각적 프로그레스 바 표시
  - 소수점 반올림 처리

## 데이터 구조

### DailyCheck 데이터 모델
```typescript
interface DailyCheck {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD 형식
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

### 주간 데이터 조회
- **기간**: 월요일 ~ 일요일
- **조회**: 습관별 이번 주 모든 체크 기록
- **캐싱**: 1분 staleTime 설정

## 핵심 함수

### 1. checkHabit(habitId, date)
```typescript
const checkHabit = async (habitId: string, date: string) => {
  // Supabase UPSERT를 통한 체크 처리
  const { data, error } = await supabase
    .from('daily_checks')
    .upsert({
      habit_id: habitId,
      date,
      completed: true,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'habit_id,date',
    });
  
  // 관련 캐시 무효화
  queryClient.invalidateQueries({ queryKey: ['dailyChecks'] });
  queryClient.invalidateQueries({ queryKey: ['weeklyProgress'] });
};
```

### 2. isDateChecked(habitId, date)
```typescript
const isDateChecked = (habitId: string, date: string): boolean => {
  return dailyChecks.some(
    (check) => check.habit_id === habitId && 
    check.date === date && 
    check.completed
  );
};
```

### 3. getWeeklyProgress(habitId, weeklyTarget)
```typescript
const getWeeklyProgress = (habitId: string, weeklyTarget: number): number => {
  const thisWeekChecks = dailyChecks.filter(
    (check) => check.habit_id === habitId && check.completed
  );
  
  return Math.min((thisWeekChecks.length / weeklyTarget) * 100, 100);
};
```

## UI 컴포넌트

### 1. 체크 버튼
- **위치**: 각 습관 카드 우측
- **상태**: 체크된 상태 (✅) / 미체크 상태 (⭕)
- **동작**: 클릭 시 체크/체크 해제 토글
- **로딩**: 처리 중 버튼 비활성화

### 2. 주간 그리드
- **구조**: 7×1 그리드 (월-일)
- **스타일**: 체크된 날짜는 파란색 배경
- **인터랙션**: 클릭 시 해당 날짜 체크/해제
- **상태**: 과거 날짜는 반투명 처리

### 3. 프로그레스 바
- **위치**: 각 습관 카드 하단
- **계산**: 주간 진행률 퍼센트
- **스타일**: 캣 테마 컬러
- **애니메이션**: 부드러운 너비 전환

## 데이터 흐름

### 체크 처리 흐름
```
사용자 클릭 → handleCheck → useDailyChecks.checkHabit → supabaseHelpers.checkHabit → 데이터베이스 UPSERT → TanStack Query 캐시 업데이트 → UI 재렌더링
```

### 주간 뷰 로드 흐름
```
컴포넌트 마운트 → useDailyChecks 훅 실행 → 주간 데이터 조회 → 캐싱 → isDateChecked로 각 날짜 상태 계산 → UI 렌더링
```

## 최적화 전략

### 1. 캐싱 전략
- **습관 목록**: 5분 staleTime
- **일일 체크**: 1분 staleTime
- **사용자 정보**: 10분 staleTime

### 2. 성능 최적화
- 불필요한 리렌더링 방지
- 메모이제이션된 계산 함수
- 배치 쿼리 무효화

### 3. 사용자 경험
- 즉각적인 UI 피드백
- 로딩 상태 시각화
- 부드러운 애니메이션

## 에러 처리

### 1. 네트워크 에러
- 자동 재시도 (3회)
- 사용자 알림
- 오프라인 상태 처리

### 2. 데이터 에러
- 유효성 검사
- 기본값 제공
- 에러 로깅

### 3. UI 에러
- 로딩 상태 표시
- 에러 메시지 표시
- 폴백 UI 제공

## 보안 고려사항

### 1. 데이터 접근
- 사용자별 데이터 격리
- Supabase RLS 정책
- 인증된 사용자만 접근

### 2. 데이터 무결성
- UPSERT로 중복 방지
- 데이터베이스 제약 조건
- 클라이언트 측 유효성 검사

## 테스트 케이스

### 1. 기능 테스트
- 당일 체크/체크 해제
- 과거 날짜 체크 시도
- 주간 진행률 정확성
- 여러 습관 동시 체크

### 2. 엣지 케이스
- 네트워크 연결 끊김
- 동시 체크 요청
- 데이터베이스 제약 조건 위반
- 만료된 세션

### 3. UI 테스트
- 반응형 디자인
- 로딩 상태 표시
- 에러 상태 처리
- 접근성

## 미래 개선 사항

### 1. 기능 확장
- 월간 뷰 추가
- 체크 통계 차트
- 습관 히스토리
- 알림 기능

### 2. 성능 개선
- 오프라인 지원
- 백그라운드 동기화
- 데이터 프리패칭
- PWA 기능

### 3. 사용자 경험
- 체크 애니메이션
- 성취 축하 메시지
- 스트릭 시각화
- 소셜 기능

## 관련 파일

### 컴포넌트
- `src/pages/HabitsPage.tsx`: 메인 체크 인터페이스

### 훅
- `src/hooks/useDailyChecks.ts`: 체크 관리 로직

### 서비스
- `src/services/supabase.ts`: 데이터베이스 API

### 타입
- `src/types/index.ts`: TypeScript 타입 정의

## 마지막 업데이트
- 날짜: 2026-01-06
- 버전: v1.0.0
- 작성자: Habit Cat 개발팀