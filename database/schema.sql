-- Lootinyang Supabase 데이터베이스 스키마
-- 습관 형성 고양이 앱 데이터베이스 설계

-- 사용자 테이블
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 100),
    exp INTEGER DEFAULT 0 CHECK (exp >= 0),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    total_habits INTEGER DEFAULT 0 CHECK (total_habits >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 습관 테이블
CREATE TABLE habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    weekly_target INTEGER NOT NULL CHECK (weekly_target BETWEEN 1 AND 7),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 일일 체크 테이블
CREATE TABLE daily_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(habit_id, date)
);

-- 아이템 테이블
CREATE TABLE items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('random', 'protection', 'special')),
    rarity VARCHAR(10) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    description TEXT,
    icon VARCHAR(50),
    effect VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 보상 상자 테이블
CREATE TABLE reward_boxes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'special')),
    is_opened BOOLEAN DEFAULT false,
    items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE
);

-- 업적 테이블
CREATE TABLE achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    condition VARCHAR(100) NOT NULL,
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    badge_color VARCHAR(7) DEFAULT '#10b981',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 업적 테이블
CREATE TABLE user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- 사용자 아이템 테이블
CREATE TABLE user_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity >= 0),
    is_used BOOLEAN DEFAULT false,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- 인덱스 생성
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_active ON habits(is_active);
CREATE INDEX idx_daily_checks_habit_id ON daily_checks(habit_id);
CREATE INDEX idx_daily_checks_date ON daily_checks(date);
CREATE INDEX idx_daily_checks_completed ON daily_checks(completed);
CREATE INDEX idx_reward_boxes_user_id ON reward_boxes(user_id);
CREATE INDEX idx_reward_boxes_type ON reward_boxes(type);
CREATE INDEX idx_reward_boxes_opened ON reward_boxes(is_opened);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_items_user_id ON user_items(user_id);

-- RLS (Row Level Security) 정책
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_items ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth_id = auth.uid());

CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (auth_id = auth.uid());

-- 습관 관련 RLS 정책
CREATE POLICY "Users can view own habits" ON habits
    FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can manage own habits" ON habits
    FOR ALL USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- 일일 체크 관련 RLS 정책
CREATE POLICY "Users can view own daily checks" ON daily_checks
    FOR SELECT USING (
        habit_id IN (
            SELECT id FROM habits 
            WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage own daily checks" ON daily_checks
    FOR ALL USING (
        habit_id IN (
            SELECT id FROM habits 
            WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        )
    );

-- 보상 상자 관련 RLS 정책
CREATE POLICY "Users can view own reward boxes" ON reward_boxes
    FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can manage own reward boxes" ON reward_boxes
    FOR ALL USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- 업적 관련 RLS 정책
CREATE POLICY "Users can view all achievements" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can manage own achievements" ON user_achievements
    FOR ALL USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- 아이템 관련 RLS 정책
CREATE POLICY "Users can view all items" ON items
    FOR SELECT USING (true);

CREATE POLICY "Users can view own items" ON user_items
    FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can manage own items" ON user_items
    FOR ALL USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_checks_updated_at BEFORE UPDATE ON daily_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 초기 데이터 삽입
-- 아이템 데이터
INSERT INTO items (name, type, rarity, description, icon, effect) VALUES
('고양이 장난감', 'random', 'common', '고양이가 좋아하는 작은 장난감', '🧸', 'exp_bonus_5'),
('고양이 간식', 'random', 'common', '맛있는 고양이 간식', '🐟', 'exp_bonus_10'),
('고양이 쿠션', 'random', 'rare', '푹신한 고양이용 쿠션', '🛋️', 'exp_bonus_20'),
('하루 보호막', 'protection', 'rare', '하루 동안 습관 체크를 잊어도 괜찮아!', '🛡️', 'skip_penalty_protection'),
('행운의 고양이', 'special', 'epic', '다음 보상 상자의 레어도가 올라가요', '🐱', 'rarity_boost'),
('황금 고양이', 'special', 'legendary', '레벨업 경험치 2배 획득!', '🏆', 'exp_double');

-- 업적 데이터
INSERT INTO achievements (name, description, icon, condition, points, badge_color) VALUES
('첫걸음', '첫 습관을 생성했어요', '👶', 'create_first_habit', 10, '#10b981'),
('일주일 꾸준함', '7일 연속 습관을 달성했어요', '📅', 'streak_7_days', 50, '#3b82f6'),
('한달의 달인', '30일 연속 습관을 달성했어요', '📆', 'streak_30_days', 200, '#8b5cf6'),
('3주 연속 성공', '3주 연속으로 주간 목표를 달성했어요', '🏅', 'three_weeks_success', 150, '#f59e0b'),
('습관 수집가', '5개의 습관을 생성했어요', '📚', 'create_5_habits', 30, '#ec4899'),
('보상 사냥꾼', '10개의 보상 상자를 열었어요', '🎁', 'open_10_boxes', 40, '#14b8a6'),
('레전드 레벨', '레벨 50에 도달했어요', '⭐', 'reach_level_50', 500, '#f97316'),
('완벽한 한달', '한달 동안 모든 습관을 100% 달성했어요', '💯', 'perfect_month', 300, '#ef4444');

-- 사용자 생성 함수
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (auth_id, email, username)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 신규 사용자 가입 시 프로필 자동 생성 트리거
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- 뷰: 사용자 통계
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.level,
    u.exp,
    u.streak,
    u.total_habits,
    COUNT(DISTINCT h.id) as active_habits,
    COUNT(DISTINCT CASE WHEN dc.completed THEN dc.id END) as total_checks,
    COUNT(DISTINCT CASE WHEN rb.is_opened THEN rb.id END) as opened_boxes,
    COUNT(DISTINCT ua.id) as achievements_count
FROM users u
LEFT JOIN habits h ON u.id = h.user_id AND h.is_active = true
LEFT JOIN daily_checks dc ON h.id = dc.habit_id
LEFT JOIN reward_boxes rb ON u.id = rb.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.username, u.level, u.exp, u.streak, u.total_habits;