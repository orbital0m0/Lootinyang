# Supabase 프로젝트 설정 가이드

## 🚀 프로젝트 생성

### 1단계: Supabase 프로젝트 생성
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. **Start Project** 클릭
3. **Organization 선택** (개인 계정일 경우)
4. **프로젝트 정보 입력**:
   - **Name**: `Lootinyang`
   - **Database Password**: 강력한 비밀번호 생성
   - **Region**: `Southeast Asia (Singapore)` 추천

### 2단계: 스키마 적용
1. **SQL Editor** 메뉴 이동
2. `database/schema.sql` 내용 복사
3. **New Project** 클릭하여 `habit-cat-app_db` 생성
4. `database/schema.sql` 전체 내용 붙여넣기
5. **Run** 버튼 클릭
6. 모든 테이블 생성 확인

### 3단계: 환경 변수 설정

#### .env.local 파일 생성
```bash
# Supabase 설정
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 개발 환경
VITE_APP_ENV=development
```

### 4단계: .gitignore 업데이트
``bash
# Supabase 관련
.env.local
.env
.env.*.local
```

## 🔗 설정 확인 사항

### 생성된 리소스
- 프로젝트 URL
- anon public key
- 데이터베이스 스키마
- 환경 변수 파일

### 다음 단계
1. 인증 시스템 테스트
2. 실제 데이터 연동 테스트
3. 전체 기능 통합 테스트

## 📱 테스트 방법

### 1. 개발 서버 시작
```bash
npm run dev
```

### 2. 인증 페이지 접속
```
http://localhost:5174/auth
```

### 3. 테스트 계정으로 테스트
```
이메일: test@example.com
비밀번호: password123
```

## 🔍 참고 자료
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase TypeScript Guide](https://supabase.com/docs/guides/auth-helpers)