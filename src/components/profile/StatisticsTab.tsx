import { motion } from 'framer-motion';
import type { User } from '../../types';

interface StatisticsTabProps {
  user: User | null;
}

export function StatisticsTab({ user }: StatisticsTabProps) {
  const stats = [
    { icon: '🔥', value: user?.streak || 7, label: '연속 일수', bgClass: 'from-orange-400 to-red-400' },
    { icon: '✅', value: 42, label: '전체 체크', bgClass: 'from-cozy-sage to-green-500' },
    { icon: '📅', value: '85%', label: '달성률', bgClass: 'from-game-exp to-blue-400' },
    { icon: '🏆', value: 12, label: '업적', bgClass: 'from-cozy-lavender to-purple-500' },
  ];

  const achievements = [
    { icon: '🎯', name: '첫 습관', color: 'bg-game-exp' },
    { icon: '🔥', name: '7일 연속', color: 'bg-cozy-orange' },
    { icon: '⭐', name: '10회 달성', color: 'bg-game-gold' },
  ];

  const weeklyStats = [
    { name: '운동하기', icon: '💪', progress: 66, completed: 2, target: 3 },
    { name: '독서하기', icon: '📚', progress: 80, completed: 4, target: 5 },
    { name: '명상하기', icon: '🧘', progress: 40, completed: 2, target: 5 },
  ];

  return (
    <motion.div
      key="stats"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Stats grid */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        role="list"
        aria-label="통계 요약"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-box relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.08 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            role="listitem"
          >
            <motion.div
              className="text-3xl mb-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              aria-hidden="true"
            >
              {stat.icon}
            </motion.div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent achievements */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
          <span className="animate-sparkle inline-block" aria-hidden="true">🏆</span>
          최근 업적
        </h3>
        <div className="grid grid-cols-3 gap-3" role="list" aria-label="최근 업적 목록">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              className={`card-achievement ${achievement.color} p-3`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -4, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              role="listitem"
            >
              <motion.div
                className="text-2xl mb-1"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                aria-hidden="true"
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

      {/* Weekly stats */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
          <span aria-hidden="true">📈</span>
          주간 통계
        </h3>
        <div className="space-y-4" role="list" aria-label="주간 습관 통계">
          {weeklyStats.map((habit, index) => (
            <motion.div
              key={habit.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              role="listitem"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-heading font-semibold text-cozy-brown-dark flex items-center gap-2">
                  <span aria-hidden="true">{habit.icon}</span> {habit.name}
                </span>
                <div className="flex items-center gap-1 bg-cozy-cream px-2 py-1 rounded-full border-2 border-cozy-brown-light text-sm">
                  <span className="font-display text-cozy-brown-dark">{habit.completed}</span>
                  <span className="text-cozy-brown-light">/</span>
                  <span className="font-display text-cozy-brown">{habit.target}</span>
                </div>
              </div>
              <div
                className="progress-bar progress-bar-cat h-4"
                role="progressbar"
                aria-valuenow={habit.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${habit.name} 진행률`}
              >
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
  );
}
