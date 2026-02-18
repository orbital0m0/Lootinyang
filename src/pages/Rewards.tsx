import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RewardBoxComponent } from '../components/RewardBox';
import { useUser, useRewards, useItems } from '../hooks';
import type { UserItem } from '../types';

export function Rewards() {
  const { user } = useUser();
  const {
    availableBoxes,
    openedBoxes,
    rewardBoxes,
    loading: rewardsLoading,
    openRewardBox,
    isOpening,
  } = useRewards(user?.id);
  const { items: userItems, loading: itemsLoading, useItem: consumeItem } = useItems(user?.id);

  const [selectedTab, setSelectedTab] = useState<'boxes' | 'items'>('boxes');

  const loading = rewardsLoading || itemsLoading;

  const handleOpenBox = async (boxId: string) => {
    try {
      await openRewardBox(boxId);
    } catch (error) {
      console.error('상자 열기 실패:', error);
    }
  };

  const handleUseItem = async (userItemId: string) => {
    try {
      await consumeItem(userItemId);
    } catch (error) {
      console.error('아이템 사용 실패:', error);
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-amber-300';
      default: return 'border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh]">
        <motion.div
          className="text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          🎁
        </motion.div>
      </div>
    );
  }

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
          보상 상자 ({availableBoxes.length})
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
          아이템 ({userItems.length})
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
            {rewardBoxes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">📦</p>
                <p className="font-medium">아직 보상 상자가 없어요</p>
                <p className="text-sm mt-1">습관을 꾸준히 달성하면 상자를 받을 수 있어요!</p>
              </div>
            ) : (
              <>
                {/* 열 수 있는 상자 */}
                {availableBoxes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-2">열 수 있는 상자</h3>
                    {availableBoxes.map((box, index) => (
                      <motion.div
                        key={box.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="mb-3"
                      >
                        <RewardBoxComponent
                          rewardBox={box}
                          onOpen={handleOpenBox}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* 열린 상자 */}
                {openedBoxes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-400 mb-2">열린 상자</h3>
                    {openedBoxes.slice(0, 5).map((box, index) => (
                      <motion.div
                        key={box.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="mb-2"
                      >
                        <RewardBoxComponent
                          rewardBox={box}
                          onOpen={() => {}}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {isOpening && (
              <div className="text-center py-4 text-gray-500 text-sm">
                상자를 여는 중...
              </div>
            )}
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
              {userItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-4xl mb-3">🧸</p>
                  <p className="font-medium">아직 보유한 아이템이 없어요</p>
                  <p className="text-sm mt-1">보상 상자를 열어 아이템을 획득해보세요!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {userItems.map((userItem: UserItem, index: number) => {
                    const itemData = userItem.item;
                    const rarity = itemData?.rarity ?? 'common';
                    return (
                      <motion.div
                        key={userItem.id}
                        className={`bg-white rounded-lg p-3 border-2 text-center relative ${getRarityBorder(rarity)}`}
                        whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <motion.div
                          className="text-2xl mb-1"
                          animate={rarity === 'epic' || rarity === 'legendary' ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          {itemData?.icon ?? '❓'}
                        </motion.div>
                        <p className="text-xs font-medium truncate">{itemData?.name ?? '알 수 없는 아이템'}</p>
                        <p className="text-xs text-gray-500">x{userItem.quantity}</p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* 아이템 사용 */}
            {userItems.filter((ui: UserItem) => ui.item?.type === 'protection' || ui.item?.type === 'special').length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold mb-3">아이템 사용</h3>
                <div className="space-y-2">
                  {userItems
                    .filter((ui: UserItem) => ui.item?.type === 'protection' || ui.item?.type === 'special')
                    .map((userItem: UserItem, index: number) => {
                      const itemData = userItem.item;
                      const rarity = itemData?.rarity ?? 'common';
                      const borderColor = rarity === 'epic' ? 'border-purple-200 hover:border-purple-400'
                        : rarity === 'legendary' ? 'border-amber-200 hover:border-amber-400'
                        : 'border-blue-200 hover:border-blue-400';

                      return (
                        <motion.button
                          key={userItem.id}
                          onClick={() => handleUseItem(userItem.id)}
                          className={`w-full flex items-center justify-between p-3 bg-white rounded-lg border-2 ${borderColor} transition-colors`}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <div className="flex items-center space-x-3">
                            <motion.span
                              className="text-xl"
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                              {itemData?.icon ?? '❓'}
                            </motion.span>
                            <div className="text-left">
                              <p className="font-medium text-sm">{itemData?.name ?? '알 수 없는 아이템'} 사용</p>
                              <p className="text-xs text-gray-500">{itemData?.description ?? ''}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{userItem.quantity}개</span>
                        </motion.button>
                      );
                    })}
                </div>
              </motion.div>
            )}
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
