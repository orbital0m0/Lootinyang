# 🚨 Supabase 타입 오류 분석 및 해결 방안

## 🔍 문제 원인 분석

### 현재 오류 상황
1. **`Property 'data' does not exist`**: Supabase API 호출 시 반환 타입 불일치
2. **`Property 'upsert' does not exist`**: upsert 메소드 미지원
3. **`Cannot find name 'User'`**: 타입 import 경로 문제

### 근본 원인
1. **Supabase 버전 호환성**: v2.x와 v3.x 사이 API 변화
2. **TypeScript 타입 정의 부족**: 실제 API 반환 타입과 불일치
3. **사용자 정의된 타입 참조**: supabaseHelpers와 실제 API 간 불일치

## 🔧 해결 방안

### 방안 1: Supabase 버전 확인
```bash
npm list supabase
```

### 방안 2: 실제 API 반환 타입 확인
Supabase v2.x 기준 타입으로 수정:

```typescript
// signIn 반환 타입
interface SignInResponse {
  user: User | null;
  session: Session | null;
}

// createUser 반환 타입  
interface SignUpResponse {
  user: User | null;
  session: Session | null;
}
```

### 방안 3: upsert 대체 로직
```typescript
// 기존 레코드 확인 후 삽입
const { data: existing } = await supabase
  .from('table')
  .select('*')
  .eq('id', id)
  .single();

if (existing) {
  // 업데이트
  await supabase
    .from('table')
    .update(updates)
    .eq('id', id);
} else {
  // 신규 생성
  await supabase
    .from('table')
    .insert({ ...data, id });
}
```

### 방안 4: 간단별 오류 해결
1. **Supabase 타입 오류 즉시 해결**
2. **업데이트/삽입 로직 분리**
3. **컴포넌트 타입 안전성 확보**

## 🎯 즉시 해결책 (권장)

### 1. 최소한의 API 호출만 구현
```typescript
// 단순화된 API 헬퍼
export const simpleSupabase = {
  async signIn(email: string, password: string) {
    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { user, session };
  },
  
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
};
```

### 2. 타입 안정성 확보
```typescript
// 안전한 타입 정의
type SafeSupabaseResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};
```

## 📈 구체적 해결 전략

### 단계 1: 긴급 안정화
1. 기존 API 호출을 최소한으로 수정
2. 타입 오류 즉시 해결
3. 인증 기능 우선 완성

### 단계 2: 완전한 타입 시스템
1. Supabase v2.x 호환 API 타입 정의
2. 컴포넌트 타입 안전성 강화
3. 업데이트/삽입 로직 개선

### 단계 3: 테스트 및 검증
1. 인증 기능 테스트
2. 오류 발생 시 즉시 확인
3. 안정성 검증

## 🚨 롤백 플랜
- **즉시 롤백**: 인증 기능에 집중
- **차후 구현**: 타입 안정성 후 다른 기능 구현
- **지속 모니터링**: 배포 환경에서의 동작 확인

## 📋 타임라인
- **현재**: 타입 오류 해결 중 (30분)
- **다음**: 컴포넌트와 훅 연동 (1시간)
- **그 후**: 습관 CRUD 기능 구현 (2시간)