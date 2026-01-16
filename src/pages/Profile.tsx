import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelProgressBar } from '../components/LevelProgressBar';
import { useUser } from '../hooks';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats');
  const [showLevelUp, setShowLevelUp] = useState(false);

  const sampleLevel = user?.level || 5;
  const sampleExp = user?.exp || 350;
  const sampleExpToNext = sampleLevel * 100;

  const handleLevelUp = () => {
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="p-4 pb-24 space-y-5 page-enter">
      {/* 프로필 헤더 - Cozy Game Style */}
      <motion.div
        className="card-reward text-center relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 배경 장식 */}
        <div className="absolute top-2 left-4 text-2xl opacity-30 animate-float">✨</div>
        <div className="absolute top-4 right-6 text-xl opacity-30 animate-sparkle">⭐</div>
        <div className="absolute bottom-3 left-8 text-lg opacity-30 animate-wiggle">🌸</div>

        <motion.div
          className="relative w-24 h-24 mx-auto mb-4"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* 아바타 프레임 */}
          <div
            className="absolute inset-0 rounded-full border-4 border-game-gold"
            style={{ boxShadow: '0 4px 0 var(--cozy-brown-dark), 0 0 20px rgba(212, 175, 55, 0.3)' }}
          />
          <div className="w-full h-full rounded-full bg-gradient-to-br from-cozy-orange-light to-cozy-orange flex items-center justify-center text-5xl">
            🐱
          </div>
          {/* 레벨 배지 */}
          <div className="level-badge absolute -bottom-1 -right-1 w-10 h-10 text-base">
            {sampleLevel}
          </div>
          <AnimatePresence>
            {showLevelUp && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, transparent 70%)' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 2 }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        <h2 className="font-display text-2xl text-cozy-brown-dark mb-1">
          {user?.username || '냥냥이'}
        </h2>
        <p className="text-sm text-cozy-brown font-body">
          {showLevelUp ? '🎉 레벨업! 🎉' : '습관의 달인을 향해 성장 중!'}
        </p>

        {/* 스트릭 배지 */}
        <motion.div
          className="streak-badge mt-4 inline-flex"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span>🔥</span>
          <span>{user?.streak || 7}일 연속</span>
        </motion.div>
      </motion.div>

      {/* 레벨 정보 카드 */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
          <span className="animate-bounce-soft inline-block">📊</span>
          레벨 정보
        </h3>
        <LevelProgressBar
          level={sampleLevel}
          currentExp={sampleExp}
          expToNextLevel={sampleExpToNext}
          showLevelUp={showLevelUp}
          size="md"
        />
        <motion.button
          onClick={handleLevelUp}
          className="w-full btn-cat mt-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mr-2">🎯</span> 레벨업 테스트
        </motion.button>
      </motion.div>

      {/* 탭 */}
      <motion.div
        className="flex bg-cozy-cream rounded-2xl p-1 border-3 border-cozy-brown-light"
        style={{ borderWidth: '3px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
            activeTab === 'stats'
              ? 'bg-cozy-lavender text-white shadow-md'
              : 'text-cozy-brown hover:bg-cozy-paper'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mr-1">📈</span> 통계
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
            activeTab === 'settings'
              ? 'bg-cozy-sage text-white shadow-md'
              : 'text-cozy-brown hover:bg-cozy-paper'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mr-1">⚙️</span> 설정
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'stats' ? (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* 통계 카드 그리드 */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {[
                { icon: '🔥', value: user?.streak || 7, label: '연속 일수', bgClass: 'from-orange-400 to-red-400' },
                { icon: '✅', value: 42, label: '전체 체크', bgClass: 'from-cozy-sage to-green-500' },
                { icon: '📅', value: '85%', label: '달성률', bgClass: 'from-game-exp to-blue-400' },
                { icon: '🏆', value: 12, label: '업적', bgClass: 'from-cozy-lavender to-purple-500' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stat-box relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + index * 0.08 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="text-3xl mb-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* 최근 업적 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
                <span className="animate-sparkle inline-block">🏆</span>
                최근 업적
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🎯', name: '첫 습관', color: 'bg-game-exp' },
                  { icon: '🔥', name: '7일 연속', color: 'bg-cozy-orange' },
                  { icon: '⭐', name: '10회 달성', color: 'bg-game-gold' },
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    className={`card-achievement ${achievement.color} p-3`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -4, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="text-2xl mb-1"
                      animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {achievement.icon}
                    </motion.div>
                    <p className="text-xs font-heading font-semibold text-cozy-brown-dark">
                      {achievement.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 주간 통계 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
                <span>📈</span>
                주간 통계
              </h3>
              <div className="space-y-4">
                {[
                  { name: '운동하기', icon: '💪', progress: 66, completed: 2, target: 3 },
                  { name: '독서하기', icon: '📚', progress: 80, completed: 4, target: 5 },
                  { name: '명상하기', icon: '🧘', progress: 40, completed: 2, target: 5 },
                ].map((habit, index) => (
                  <motion.div
                    key={habit.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-heading font-semibold text-cozy-brown-dark flex items-center gap-2">
                        <span>{habit.icon}</span> {habit.name}
                      </span>
                      <div className="flex items-center gap-1 bg-cozy-cream px-2 py-1 rounded-full border-2 border-cozy-brown-light text-sm">
                        <span className="font-display text-cozy-brown-dark">{habit.completed}</span>
                        <span className="text-cozy-brown-light">/</span>
                        <span className="font-display text-cozy-brown">{habit.target}</span>
                      </div>
                    </div>
                    <div className="progress-bar progress-bar-cat h-4">
                      <motion.div
                        className="progress-fill progress-fill-cat"
                        initial={{ width: 0 }}
                        animate={{ width: `${habit.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* 알림 설정 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
                <span>🔔</span> 알림 설정
              </h3>
              <div className="space-y-4">
                {[
                  { name: '습관 리마인더', description: '매일 9시 알림', enabled: true },
                  { name: '보상 알림', description: '상자 획득 시 알림', enabled: false },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-cozy-cream rounded-xl border-2 border-cozy-brown-light"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.08 }}
                  >
                    <div>
                      <p className="font-heading font-semibold text-cozy-brown-dark">{item.name}</p>
                      <p className="text-xs text-cozy-brown font-body">{item.description}</p>
                    </div>
                    <motion.button
                      className={`w-14 h-8 rounded-full relative transition-colors border-3 ${
                        item.enabled
                          ? 'bg-cozy-sage border-cozy-sage-dark'
                          : 'bg-cozy-brown-light border-cozy-brown'
                      }`}
                      style={{ borderWidth: '3px' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.span
                        className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                        initial={false}
                        animate={{ left: item.enabled ? 'calc(100% - 26px)' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 테마 설정 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
                <span className="animate-wiggle inline-block">🎨</span> 테마 설정
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: '기본', color: 'bg-cozy-orange', active: true },
                  { name: '민트', color: 'bg-cozy-sage', active: false },
                  { name: '라벤더', color: 'bg-cozy-lavender', active: false },
                  { name: '로즈', color: 'bg-cozy-rose', active: false },
                ].map((theme, index) => (
                  <motion.button
                    key={theme.name}
                    className={`p-3 rounded-xl transition-all border-3 ${
                      theme.active
                        ? 'bg-cozy-paper border-cozy-orange shadow-md'
                        : 'bg-cozy-cream border-cozy-brown-light'
                    }`}
                    style={{ borderWidth: '3px' }}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + index * 0.08 }}
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-full ${theme.color} mx-auto mb-2 border-3 border-cozy-brown`}
                      style={{ borderWidth: '3px', boxShadow: '0 2px 0 var(--cozy-brown-dark)' }}
                      animate={theme.active ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <p className="text-xs font-heading font-semibold text-cozy-brown-dark">{theme.name}</p>
                    {theme.active && <span className="text-xs">✓</span>}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* 계정 설정 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
                <span>🔐</span> 계정
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '📧', label: '이메일 변경', danger: false },
                  { icon: '🔒', label: '비밀번호 변경', danger: false },
                ].map((item, index) => (
                  <motion.button
                    key={item.label}
                    className="w-full btn-secondary text-left flex items-center gap-3"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + index * 0.08 }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-heading font-semibold">{item.label}</span>
                  </motion.button>
                ))}
                <motion.button
                  onClick={handleLogout}
                  className="w-full py-4 px-6 rounded-xl font-heading font-semibold text-white flex items-center justify-center gap-3 border-3"
                  style={{
                    background: 'linear-gradient(180deg, #E57373 0%, #D32F2F 100%)',
                    borderWidth: '3px',
                    borderColor: '#B71C1C',
                    boxShadow: '0 4px 0 #7F0000',
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98, y: 2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-xl">🚪</span>
                  <span>로그아웃</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 푸터 링크 */}
      <motion.div
        className="text-center py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-center gap-4 text-sm text-cozy-brown font-body">
          <button className="hover:text-cozy-brown-dark transition-colors">개인정보처리방침</button>
          <span className="text-cozy-brown-light">•</span>
          <button className="hover:text-cozy-brown-dark transition-colors">이용약관</button>
        </div>
        <p className="text-xs text-cozy-brown-light mt-2">Lootinyang v1.0.0</p>
      </motion.div>
    </div>
  );
}