import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RewardBoxComponent } from '../components/RewardBox';
import type { RewardBox, Item } from '../types';

export function Rewards() {
  const [selectedTab, setSelectedTab] = useState<'boxes' | 'items'>('boxes');

  // 샘플 아이템 데이터
  const sampleItems: Item[] = [
    { id: '1', name: '고양이 장난감', type: 'random', rarity: 'common', description: '고양이가 좋아하는 장난감입니다.', icon: '🧸' },
    { id: '2', name: '고양이 간식', type: 'random', rarity: 'common', description: '맛있는 간식입니다.', icon: '🐟' },
    { id: '3', name: '고양이 쿠션', type: 'random', rarity: 'rare', description: '푹신한 쿠션입니다.', icon: '🛋️' },
    { id: '4', name: '하루 보호막', type: 'protection', rarity: 'rare', description: '하루 체크를 잊어도 괜찮아요.', icon: '🛡️' },
    { id: '5', name: '행운의 고양이', type: 'special', rarity: 'epic', description: '다음 상자 레어도 UP!', icon: '🐱' },
    { id: '6', name: '고양이 왕관', type: 'special', rarity: 'legendary', description: '전설의 왕관입니다.', icon: '👑' },
    { id: '7', name: '고양이 날개', type: 'special', rarity: 'epic', description: '날개가 생겼어요!', icon: '🦋' },
    { id: '8', name: '고양이 마법봉', type: 'special', rarity: 'rare', description: '마법을 부릴 수 있어요.', icon: '🪄' },
  ];

  // 샘플 보상 상자 데이터
  const sampleRewardBoxes: RewardBox[] = [
    {
      id: 'box-1',
      user_id: 'user-1',
      type: 'daily',
      is_opened: false,
      items: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 'box-2',
      user_id: 'user-1',
      type: 'weekly',
      is_opened: false,
      items: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 'box-3',
      user_id: 'user-1',
      type: 'special',
      is_opened: false,
      items: [],
      created_at: new Date().toISOString(),
    },
  ];

  const [openedBoxes, setOpenedBoxes] = useState<Set<string>>(new Set());

  const handleOpenBox = (boxId: string) => {
    setOpenedBoxes(prev => new Set([...prev, boxId]));
  };

  return (
    <div className="p-4 space-y-4">
      {/* 페이지 헤더 */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">🎁 보상 센터</h2>
        <p className="text-sm text-gray-600">
          습관 달성으로 얻은 보상을 확인하세요!
        </p>
      </div>

      {/* 탭 */}
      <motion.div
        className="flex bg-gray-100 rounded-lg p-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'boxes'
              ? 'bg-white text-primary-500 shadow-sm'
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('boxes')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          보상 상자 (3)
        </motion.button>
        <motion.button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'items'
              ? 'bg-white text-primary-500 shadow-sm'
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('items')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          아이템 (8)
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedTab === 'boxes' ? (
          <motion.div
            key="boxes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {sampleRewardBoxes.map((box, index) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RewardBoxComponent
                  rewardBox={{...box, is_opened: openedBoxes.has(box.id)}}
                  onOpen={handleOpenBox}
                  items={sampleItems}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="items"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* 보유 아이템 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold mb-3">보유 아이템</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '🧸', name: '고양이 장난감', count: 3, rarity: 'common' },
                  { icon: '🐟', name: '고양이 간식', count: 5, rarity: 'common' },
                  { icon: '🛋️', name: '고양이 쿠션', count: 1, rarity: 'rare' },
                  { icon: '🛡️', name: '하루 보호막', count: 2, rarity: 'rare' },
                  { icon: '🐱', name: '행운의 고양이', count: 1, rarity: 'epic' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`bg-white rounded-lg p-3 border-2 text-center relative ${
                      item.rarity === 'common' ? 'border-gray-200' :
                      item.rarity === 'rare' ? 'border-blue-300' :
                      item.rarity === 'epic' ? 'border-purple-300' :
                      'border-amber-300'
                    }`}
                    whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.div
                      className="text-2xl mb-1"
                      animate={item.rarity === 'epic' || item.rarity === 'rare' ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {item.icon}
                    </motion.div>
                    <p className="text-xs font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.count}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 아이템 사용 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold mb-3">아이템 사용</h3>
              <div className="space-y-2">
                <motion.button
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.span
                      className="text-xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      🛡️
                    </motion.span>
                    <div className="text-left">
                      <p className="font-medium text-sm">하루 보호막 사용</p>
                      <p className="text-xs text-gray-500">오늘 체크를 잊어도 괜찮아요</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2개</span>
                </motion.button>

                <motion.button
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.span
                      className="text-xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      🐱
                    </motion.span>
                    <div className="text-left">
                      <p className="font-medium text-sm">행운의 고양이 사용</p>
                      <p className="text-xs text-gray-500">다음 상자 레어도 UP!</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">1개</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 빠른 액션 */}
      <motion.div
        className="grid grid-cols-2 gap-3 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="btn-secondary"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          📊 획득 기록
        </motion.button>
        <motion.button
          className="btn-secondary"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          🎯 목표 확인
        </motion.button>
      </motion.div>
    </div>
  );
}