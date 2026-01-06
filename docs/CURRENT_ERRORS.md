# 🚨 현재 진행 중인 이슈

### 2026-01-06 - Supabase 타입 및 빌드 오류 (재발)
**문제**: Supabase 헬퍼 함수 및 타입 불일치로 인한 빌드 실패
- **에러 메시지**:
  - `Property 'data' does not exist on type 'PostgrestBuilder<any, any, false>'`
  - `Property 'upsert' does not exist on type 'PostgrestBuilder<any, any, false>'`
  - `Cannot find name 'User'` (multiple occurrences)
  - `Cannot find name 'supabase'`
- **원인**:
  1. Supabase 타입 정의와 실제 API 인터페이스 불일치
  2. 컴포넌트에서 반환 타입 불일치
  3. 사용하지 않는 import로 인한 타입 오류
- **재시도 해결 방안**:
  1. 기존 `supabase-helpers-update.ts` 파일 제거
  2. Supabase helpers 함수 재작성
  3. 컴포넌트 타입 수정
  4. 명시적 타입 지정
- **상태**: 🔧 재해결 중

### 이전 해결된 이슈 참고
- **2026-01-06 - TanStack Query 커스텀 훅 타입 오류**: 해결됨
- 현재 Supabase 타입 관련 오류는 이전과 다른 원인