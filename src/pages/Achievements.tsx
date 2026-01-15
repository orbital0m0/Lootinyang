import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementBadge } from '../components/AchievementBadge';
import type { Achievement } from '../types';

export function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'challenge' | 'consistency' | 'reward' | 'legendary'>('all');

  // 샘플 업적 데이터
  const sampleAchievements: Achievement[] = [
    { id: '1', name: '첫걸음', description: '첫 습관을 생성했어요', icon: '👶', condition: '습관 1개 생성', points: 10, badge_color: 'common' },
    { id: '2', name: '습관 수집가', description: '5개의 습관을 생성했어요', icon: '📚', condition: '습관 5개 생성', points: 20, badge_color: 'rare' },
    { id: '3', name: '3주 연속 성공', description: '3주 연속으로 주간 목표를 달성했어요', icon: '🏅', condition: '3주 연속 주간 목표 달성', points: 50, badge_color: 'epic' },
    { id: '4', name: '일주일 꾸준함', description: '7일 연속 습관을 달성했어요', icon: '📆', condition: '7일 연속 습관 달성', points: 30, badge_color: 'rare' },
    { id: '5', name: '한달의 달인', description: '30일 연속 습관을 달성했어요', icon: '📈', condition: '30일 연속 습관 달성', points: 100, badge_color: 'epic' },
    { id: '6', name: '완벽한 한달', description: '한달 동안 모든 습관을 100% 달성했어요', icon: '💯', condition: '한달 100% 달성', points: 150, badge_color: 'legendary' },
    { id: '7', name: '보상 사냥꾼', description: '10개의 보상 상자를 열었어요', icon: '🎁', condition: '보상 상자 10개 오픈', points: 40, badge_color: 'rare' },
    { id: '8', name: '전설의 레벨', description: '레벨 50에 도달했어요', icon: '🏆', condition: '레벨 50 도달', points: 500, badge_color: 'legendary' },
  ];

  // 샘플 업적 달성 상태
  const unlockedAchievements = new Set(['1', '4']);

  // 업적 카테고리
  const categories = [
    { id: 'all', name: '전체', icon: '📋' },
    { id: 'challenge', name: '도전 과제', icon: '🎯' },
    { id: 'consistency', name: '꾸준함', icon: '🔥' },
    { id: 'reward', name: '보상 헌터', icon: '🎁' },
    { id: 'legendary', name: '전설', icon: '⭐' },
  ];

  // 필터링된 업적
  const filteredAchievements = selectedCategory === 'all'
    ? sampleAchievements
    : sampleAchievements.filter(a => {
        if (selectedCategory === 'challenge') return ['1', '2'].includes(a.id);
        if (selectedCategory === 'consistency') return ['4', '5', '6'].includes(a.id);
        if (selectedCategory === 'reward') return ['7'].includes(a.id);
        if (selectedCategory === 'legendary') return ['8'].includes(a.id);
        return true;
      });

  // 총 포인트 계산
  const totalPoints = sampleAchievements
    .filter(a => unlockedAchievements.has(a.id))
    .reduce((sum, a) => sum + a.points, 0);

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
            onClick={() => setSelectedCategory(category.id as 'all' | 'challenge' | 'consistency' | 'reward' | 'legendary')}
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
          {filteredAchievements.map((achievement, index) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              isUnlocked={unlockedAchievements.has(achievement.id)}
              progress={[0, 60, 33, 100, 23, 0, 80, 10][index]}
              onUnlock={() => {}}
              size="md"
            />
          ))}
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
            { label: '완료', value: unlockedAchievements.size, color: 'text-green-500' },
            { label: '진행 중', value: sampleAchievements.length - unlockedAchievements.size, color: 'text-orange-500' },
            { label: '잠김', value: sampleAchievements.length - sampleAchievements.filter(a => unlockedAchievements.has(a.id)).length, color: 'text-gray-500' },
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
