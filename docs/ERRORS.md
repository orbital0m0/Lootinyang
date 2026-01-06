# 🐛 오류 및 문제 해결 로그

## 🚨 현재 진행 중인 이슈
- (현재 없음)

---

## ✅ 해결된 이슈

### 2026-01-06 - Tailwind CSS 설정 오류
**문제**: `npx tailwindcss init -p` 명령어 실행 실패
- **에러 메시지**: `npm error could not determine executable to run`
- **원인**: tailwindcss가 개발 의존성으로 설치되지 않음
- **해결**: `npm install -D tailwindcss postcss autoprefixer` 후 설정 파일 수동 생성
- **상태**: ✅ 해결됨

---

## 🔄 잠재적 문제 및 예방 조치

### Supabase 연동 관련
**예상 문제**: 
- CORS 설정 오류
- 인증 토큰 만료
- RLS (Row Level Security) 정책 오류

**예방 조치**:
- Supabase 프로젝트 설정 시 CORS 도메인 미리 추가
- 토큰 리프레시 로직 구현
- RLS 정책 테스트 환경에서 검증

### 토스 미니앱 SDK 관련
**예상 문제**:
- SDK 버전 호환성
- 미니앱 레이아웃 제약
- 사용자 인증 연동

**예방 조치**:
- 최신 SDK 버전 사용 및 문서 확인
- 375px 너비 제약에 맞는 반응형 디자인
- 테스트 계정으로 인증 흐름 검증

### 상태 관리 관련
**예상 문제**:
- TanStack Query 캐시 무효화
- 동시 상태 업데이트 충돌
- 오프라인 상태 처리

**예방 조치**:
- 적절한 queryKey 설계 및 캐시 전략
- 낙관적 업데이트 및 롤백 로직
- 오프라인 상태 감지 및 UI 처리

---

## 🛠️ 디버깅 팁 및 도구

### 브라우저 개발자 도구
- **React DevTools**: 컴포넌트 상태 및 props 확인
- **Redux DevTools**: (사용 시) 상태 변화 추적
- **Network 탭**: API 요청/응답 확인
- **Console**: 에러 로그 및 디버깅 메시지

### Supabase 디버깅
- **Supabase 대시보드**: 데이터베이스 쿼리 로그
- **Auth 로그**: 사용자 인증 흐름 추적
- **Realtime 구독**: 실시간 데이터 동기화 확인

### 모바일 테스트
- **Chrome DevTools Device Mode**: 모바일 뷰포트 테스트
- **실제 기능 테스트**: iOS/Android 실제 기기 테스트
- **토스 시뮬레이터**: 토스 미니앱 환경 테스트

---

## 📝 에러 처리 가이드라인

### API 에러 처리
```typescript
// 예시: Supabase 에러 처리
try {
  const { data, error } = await supabase
    .from('habits')
    .select('*');
  
  if (error) throw error;
  return data;
} catch (error) {
  console.error('습관 데이터 로딩 실패:', error);
  // 사용자에게 친숙한 에러 메시지 표시
  throw new Error('습관 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
}
```

### 컴포넌트 에러 바운더리
```typescript
// 예시: 에러 바운더리 구현
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('컴포넌트 에러:', error, errorInfo);
    // 에러 로깅 서비스에 전송 (선택적)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 사용자 피드백
- **로딩 상태**: 스켈레톤 UI 또는 스피너
- **성공 상태**: 체크마크 또는 성공 애니메이션
- **에러 상태**: 친절한 에러 메시지 및 재시도 버튼
- **빈 상태**: 안내 메시지 및 초기 설정 안내

---

## 🔍 모니터링 및 로깅

### 추천 도구
- **Sentry**: 에러 추적 및 성능 모니터링
- **LogRocket**: 사용자 세션 기록 및 디버깅
- **Google Analytics**: 사용자 행동 분석
- **Supabase Analytics**: 데이터베이스 성능 모니터링

### 로깅 전략
- **개발 환경**: 상세한 콘솔 로그
- **프로덕션**: 최소한의 로그 + 에러 추적
- **사용자 행동**: 주요 기능 사용 로그 (선택적)
- **성능 지표**: 로딩 시간 및 API 응답 시간

---

## 📞 문제 보고 및 지원

### 버그 리포트 양식
1. **재현 단계**: 구체적인 조건 및 순서
2. **기기 정보**: OS, 브라우저, 앱 버전
3. **스크린샷**: 문제 상황 캡처
4. **예상 동작**: 정상적으로 동작해야 하는 결과
5. **실제 동작**: 현재 관찰되는 문제

### 우선순위 분류
- **Critical**: 앱 사용 불가 (로그인, 데이터 로딩 등)
- **High**: 주요 기능 오작동 (습관 체크, 보상 등)
- **Medium**: 부가 기능 문제 (UI, 애니메이션 등)
- **Low**: 사소한 문제 (오타, 디자인 미세 조정 등)