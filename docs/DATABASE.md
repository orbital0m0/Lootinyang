# Supabase 데이터베이스 설정 가이드

## 🗄️ 데이터베이스 스키마 개요

Lootinyang 앱의 Supabase 데이터베이스 스키마입니다. 습관 관리, 게이미피케이션, 보상 시스템을 지원합니다.

## 📋 테이블 구조

### 1. users (사용자)
```sql
- id: UUID (PK)
- auth_id: UUID (auth.users와 연결)
- username: VARCHAR(50) (유니크)
- email: VARCHAR(255) (유니크)
- level: INTEGER (1-100)
- exp: INTEGER (경험치)
- streak: INTEGER (연속 일수)
- total_habits: INTEGER (총 습관 수)
- created_at, updated_at: TIMESTAMP
```

### 2. habits (습관)
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- name: VARCHAR(100)
- weekly_target: INTEGER (1-7, 주 N회 목표)
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMP
```

### 3. daily_checks (일일 체크)
```sql
- id: UUID (PK)
- habit_id: UUID (FK)
- date: DATE
- completed: BOOLEAN
- created_at, updated_at: TIMESTAMP
- UNIQUE(habit_id, date)
```

### 4. items (아이템)
```sql
- id: UUID (PK)
- name: VARCHAR(100)
- type: ENUM('random', 'protection', 'special')
- rarity: ENUM('common', 'rare', 'epic', 'legendary')
- description: TEXT
- icon: VARCHAR(50)
- effect: VARCHAR(100)
```

### 5. reward_boxes (보상 상자)
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- type: ENUM('daily', 'weekly', 'monthly', 'special')
- is_opened: BOOLEAN
- items: JSONB (아이템 목록)
- created_at, opened_at: TIMESTAMP
```

### 6. achievements (업적)
```sql
- id: UUID (PK)
- name: VARCHAR(100)
- description: TEXT
- icon: VARCHAR(50)
- condition: VARCHAR(100)
- points: INTEGER
- badge_color: VARCHAR(7)
```

### 7. user_achievements (사용자 업적)
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- achievement_id: UUID (FK)
- unlocked_at: TIMESTAMP
- UNIQUE(user_id, achievement_id)
```

### 8. user_items (사용자 아이템)
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- item_id: UUID (FK)
- quantity: INTEGER
- is_used: BOOLEAN
- acquired_at: TIMESTAMP
```

## 🔒 보안 설정 (RLS)

### Row Level Security 정책
- 사용자는 자신의 데이터에만 접근 가능
- 공용 데이터(아이템, 업적)은 모두 접근 가능
- 모든 테이블에 RLS 활성화

### 주요 정책
```sql
-- 사용자 데이터 접근
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth_id = auth.uid());

-- 습관 데이터 접근
CREATE POLICY "Users can manage own habits" ON habits
    FOR ALL USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));
```

## 🚀 초기 데이터

### 아이템 데이터
- 🧸 고양이 장난감 (common, exp_bonus_5)
- 🐟 고양이 간식 (common, exp_bonus_10)
- 🛋️ 고양이 쿠션 (rare, exp_bonus_20)
- 🛡️ 하루 보호막 (rare, skip_penalty_protection)
- 🐱 행운의 고양이 (epic, rarity_boost)
- 🏆 황금 고양이 (legendary, exp_double)

### 업적 데이터
- 👶 첫걸음 (10점)
- 📅 일주일 꾸준함 (50점)
- 📆 한달의 달인 (200점)
- 🏅 3주 연속 성공 (150점)
- 📚 습관 수집가 (30점)
- 🎁 보상 사냥꾼 (40점)
- ⭐ 레전드 레벨 (500점)
- 💯 완벽한 한달 (300점)

## 🔧 트리거 및 함수

### 자동 업데이트 트리거
```sql
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 사용자 프로필 자동 생성
```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();
```

## 📊 뷰

### user_stats 통계 뷰
사용자의 전체 통계 정보를 제공하는 뷰:
- 활성 습관 수
- 전체 체크 수
- 열린 상자 수
- 업적 수

## 🛠️ 설정 방법

### 1. Supabase 프로젝트 생성
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 새 프로젝트 생성
3. 데이터베이스 설정 복사

### 2. SQL 실행
1. Supabase Dashboard > SQL Editor
2. `schema.sql` 내용 복사하여 실행
3. 모든 테이블, 정책, 트리거 확인

### 3. 환경 변수 설정
```bash
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 인증 설정
1. Authentication > Settings
2. Site URL 설정
3. Redirect URLs 설정
4. Email provider 설정

## 🧪 테스트 데이터

### 테스트 사용자 생성
```sql
-- 수동 테스트 사용자
INSERT INTO users (auth_id, email, username, level, exp, streak, total_habits)
VALUES (
    gen_random_uuid(),
    'test@example.com',
    'testuser',
    5,
    250,
    7,
    3
);
```

### 테스트 습관 생성
```sql
INSERT INTO habits (user_id, name, weekly_target)
VALUES (
    (SELECT id FROM users WHERE username = 'testuser'),
    '운동하기',
    3
);
```

## 🔍 모니터링

### 성능 최적화
- 인덱스 적용된 상태 확인
- 쿼리 성능 모니터링
- 데이터베이스 크기 관리

### 보안 검토
- RLS 정책 동작 확인
- 인증 토큰 유효성 검사
- API 접근 제한 확인

## 🚨 주의사항

### 데이터 일관성
- 외래 키 제약 조건 확인
- UNIQUE 제약 조건 준수
- CHECK 제약 조건 검증

### 백업 및 복구
- 정기적인 데이터베이스 백업
- 스키마 변경 전 백업 필수
- 롤백 계획 수립

### 성능 고려사항
- 대량 데이터 처리 시 배치 사용
- 인덱스 적절한 활용
- 쿼리 최적화 필요