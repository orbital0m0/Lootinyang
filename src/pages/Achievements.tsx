import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementBadge } from '../components/AchievementBadge';
import { useUser, useAchievements } from '../hooks';

export function Achievements() {
  const { user } = useUser();
  const {
    allAchievements,
    loading,
    error,
    getAchievementsByCategory,
    getStatsByCategory,
    isAchievementUnlocked,
    getTotalPoints,
    getProgressByAchievement,
  } = useAchievements(user?.id);

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'challenge' | 'consistency' | 'reward' | 'legendary'>('all');

  // 업적 카테고리
  const categories = [
    { id: 'all', name: '전체', icon: '📋' },
    { id: 'challenge', name: '도전 과제', icon: '🎯' },
    { id: 'consistency', name: '꾸준함', icon: '🔥' },
    { id: 'reward', name: '보상 헌터', icon: '🎁' },
    { id: 'legendary', name: '전설', icon: '⭐' },
  ];

  // 카테고리별 필터링
  const categoryMap = getAchievementsByCategory();
  const filteredAchievements = selectedCategory === 'all'
    ? allAchievements
    : categoryMap[selectedCategory] ?? [];

  // 통계
  const stats = getStatsByCategory();
  const totalPoints = getTotalPoints();

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh]">
        <motion.div
          className="text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          🏆
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>업적을 불러오는데 실패했습니다.</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* 페이지 헤더 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-xl font-bold mb-2"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🏆 업적
        </motion.h2>
        <p className="text-sm text-gray-600">
          달성한 업적과 진행상황을 확인하세요!
        </p>
      </motion.div>

      {/* 카테고리 탭 */}
      <motion.div
        className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as typeof selectedCategory)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-cat-orange to-cat-pink text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            {category.icon} {category.name}
          </motion.button>
        ))}
      </motion.div>

      {/* 업적 리스트 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          className="grid grid-cols-1 gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredAchievements.length === 0 ? (
            <p className="text-center text-gray-400 py-8">이 카테고리에 업적이 없습니다.</p>
          ) : (
            filteredAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                isUnlocked={isAchievementUnlocked(achievement.id)}
                progress={getProgressByAchievement(achievement.id)}
                size="md"
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* 통계 */}
      <motion.div
        className="card text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold mb-3">📊 업적 통계</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '완료', value: stats.overall.unlocked, color: 'text-green-500' },
            { label: '진행 중', value: stats.overall.total - stats.overall.unlocked, color: 'text-orange-500' },
            { label: '달성률', value: `${stats.overall.percentage}%`, color: 'text-blue-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 업적 포인트 */}
      <motion.div
        className="card text-center bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02, y: -3 }}
      >
        <motion.div
          className="text-2xl mb-1"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ⭐
        </motion.div>
        <p className="text-sm font-medium text-gray-700">총 업적 포인트</p>
        <motion.p
          className="text-3xl font-bold text-amber-600"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {totalPoints}
        </motion.p>
      </motion.div>
    </div>
  );
}
