import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelProgressBar } from '../components/LevelProgressBar';
import { useUser } from '../hooks';

export function Profile() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats');
  const [showLevelUp, setShowLevelUp] = useState(false);

  // 샘플 레벨 계산
  const sampleLevel = user?.level || 5;
  const sampleExp = user?.exp || 350;
  const sampleExpToNext = sampleLevel * 100; // 간단한 계산

  const handleLevelUp = () => {
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* 페이지 헤더 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-cat-orange to-cat-orange-dark rounded-full flex items-center justify-center text-4xl shadow-lg relative"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          🐱
          <AnimatePresence>
            {showLevelUp && (
              <motion.div
                className="absolute inset-0 bg-yellow-400/50 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 2 }}
                transition={{ duration: 1 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
        <h2 className="text-xl font-bold">{user?.username || '냥냥이'}</h2>
        <p className="text-sm text-gray-600">
          {showLevelUp ? '🎉 레벨업! 🎉' : '경험치 치사각'}
        </p>
      </motion.div>

      {/* 레벨 정보 */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold mb-3">📊 레벨 정보</h3>
        <LevelProgressBar
          level={sampleLevel}
          currentExp={sampleExp}
          expToNextLevel={sampleExpToNext}
          showLevelUp={showLevelUp}
          size="md"
        />
      </motion.div>

      {/* 레벨업 테스트 버튼 */}
      <motion.button
        onClick={handleLevelUp}
        className="w-full py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        🎯 레벨업 테스트
      </motion.button>

      {/* 탭 */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'stats' 
              ? 'bg-white text-primary-500 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          통계
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings' 
              ? 'bg-white text-primary-500 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          설정
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'stats' ? (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* 통계 카드 그리드 */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: '🔥', value: '7', label: '연속 일수', color: 'text-orange-500' },
                { icon: '✅', value: '42', label: '전체 체크', color: 'text-green-500' },
                { icon: '📅', value: '85%', label: '달성률', color: 'text-blue-500' },
                { icon: '🏆', value: '12', label: '업적', color: 'text-purple-500' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="card-achievement"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="text-2xl mb-1"
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.p
                      className={`text-2xl font-bold ${stat.color}`}
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* 최근 업적 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="font-semibold mb-3">🏆 최근 업적</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '🎯', name: '첫 습관', color: 'from-blue-400 to-blue-600' },
                  { icon: '🔥', name: '7일 연속', color: 'from-orange-400 to-red-500' },
                  { icon: '⭐', name: '10회 달성', color: 'from-yellow-400 to-amber-500' },
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    className={`card-achievement bg-gradient-to-br ${achievement.color} text-white`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center">
                      <motion.div
                        className="text-2xl mb-1"
                        animate={{
                          rotate: [0, -10, 10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.3,
                        }}
                      >
                        {achievement.icon}
                      </motion.div>
                      <p className="text-xs font-medium">{achievement.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 주간 통계 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h3 className="font-semibold mb-3">📈 주간 통계</h3>
              <div className="space-y-3">
                {[
                  { name: '운동하기', progress: 66, completed: 2 },
                  { name: '독서하기', progress: 80, completed: 4 },
                  { name: '명상하기', progress: 40, completed: 2 },
                ].map((habit, index) => (
                  <motion.div
                    key={habit.name}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                  >
                    <span className="text-sm">{habit.name}</span>
                    <div className="flex items-center space-x-2">
                      <motion.div
                        className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          className="bg-gradient-to-r from-cat-orange to-cat-pink h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${habit.progress}%` }}
                          transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
                        />
                      </motion.div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        {habit.completed}/3
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
        /* 설정 탭 */
        <motion.div
          key="settings"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* 알림 설정 */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold mb-3">⚙️ 알림 설정</h3>
            <div className="space-y-3">
              {[
                { name: '습관 리마인더', description: '매일 9시 알림', enabled: true },
                { name: '보상 알림', description: '상자 획득 시 알림', enabled: false },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <motion.button
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      item.enabled ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.span
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      initial={false}
                      animate={{
                        left: item.enabled ? 'calc(100% - 20px)' : '4px',
                      }}
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
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-semibold mb-3">🎨 테마 설정</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: '기본', color: 'bg-primary-500' },
                { name: '오렌지', color: 'bg-cat-orange' },
                { name: '보라', color: 'bg-cat-purple' },
                { name: '핑크', color: 'bg-cat-pink' },
              ].map((theme, index) => (
                <motion.button
                  key={theme.name}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    index === 0 ? 'border-primary-500' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-full ${theme.color} mx-auto mb-1`}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.2,
                    }}
                  />
                  <p className="text-xs">{theme.name}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* 계정 설정 */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="font-semibold mb-3">🔐 계정</h3>
            <div className="space-y-2">
              {[
                { icon: '📧', label: '이메일 변경', color: 'text-gray-700' },
                { icon: '🔒', label: '비밀번호 변경', color: 'text-gray-700' },
                { icon: '🚪', label: '로그아웃', color: 'text-red-500' },
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  className="w-full btn-secondary text-left"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  <span className={item.color}>
                    {item.icon} {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
       )}
      </AnimatePresence>

      {/* 링크 */}
      <motion.div
        className="text-center space-y-2 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <button className="text-sm text-gray-500">개인정보처리방침</button>
        <span className="text-gray-300">•</span>
        <button className="text-sm text-gray-500">이용약관</button>
      </motion.div>
    </div>
  );
}