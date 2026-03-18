import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RewardBox, RewardItem } from '../types';

interface RewardBoxProps {
  rewardBox: RewardBox;
  onOpen: (boxId: string) => void;
  items?: RewardItem[];
}

export function RewardBoxComponent({ rewardBox, onOpen, items = [] }: RewardBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [rewardItem, setRewardItem] = useState<RewardItem | null>(null);

  const boxIcons: Record<RewardBox['type'], string> = {
    normal: '📦',
    premium: '🎁',
    event: '🏆',
  };

  const boxThemes: Record<RewardBox['type'], string> = {
    normal: 'from-blue-400 to-blue-500',
    premium: 'from-purple-400 to-pink-500',
    event: 'from-amber-400 to-amber-500',
  };

  const boxAnimations: Record<RewardBox['type'], string> = {
    normal: 'animate-pulse-slow',
    premium: 'animate-wiggle',
    event: 'animate-bounce',
  };

  const boxLabels: Record<RewardBox['type'], string> = {
    normal: '일반 보상 상자',
    premium: '프리미엄 상자',
    event: '이벤트 상자',
  };

  const rarityColors = {
    common: 'bg-gray-200 border-gray-400',
    rare: 'bg-blue-200 border-blue-500',
    epic: 'bg-purple-200 border-purple-500',
    legendary: 'bg-amber-200 border-amber-500',
  };

  const rarityEffects = {
    common: '',
    rare: 'shadow-lg shadow-blue-500/30',
    epic: 'shadow-xl shadow-purple-500/40',
    legendary: 'shadow-2xl shadow-amber-500/50',
  };

  const handleOpen = () => {
    if (rewardBox.is_opened) return;

    setIsOpen(true);
    onOpen(rewardBox.id);

    // 랜덤 아이템 선택
    setTimeout(() => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setRewardItem(randomItem);
      setShowItem(true);
    }, 1000);
  };

  return (
    <div className="relative">
      {/* 상자 컴포넌트 */}
      <motion.div
        className={`card p-4 relative overflow-hidden ${rewardBox.is_opened ? 'opacity-75' : ''}`}
        whileHover={!rewardBox.is_opened ? { scale: 1.02 } : {}}
        whileTap={!rewardBox.is_opened ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* 상단 정보 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <motion.span
              className="text-3xl"
              animate={rewardBox.is_opened ? {} : { rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {boxIcons[rewardBox.type]}
            </motion.span>
            <div>
              <h3 className="font-semibold text-gray-800">
                {boxLabels[rewardBox.type]}
              </h3>
              <p className="text-xs text-gray-500">
                {rewardBox.is_opened ? '이미 열었습니다' : '오픈 가능'}
              </p>
            </div>
          </div>
          <div className={`text-xs font-bold ${
            rewardBox.is_opened ? 'text-gray-400' : 'text-green-500'
          }`}>
            {rewardBox.is_opened ? '✅' : '🎁'}
          </div>
        </div>

        {/* 상자 상태 */}
        {rewardBox.is_opened ? (
          <div className="w-full py-3 bg-gray-100 rounded-xl text-gray-500 text-center text-sm">
            이미 열었습니다 📦
          </div>
        ) : (
          <motion.button
            onClick={handleOpen}
            disabled={isOpen}
            className={`w-full py-3 bg-gradient-to-r ${boxThemes[rewardBox.type]} text-white rounded-xl font-bold ${boxAnimations[rewardBox.type]}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {isOpen ? '열리는 중...' : '🎁 상자 열기'}
          </motion.button>
        )}
      </motion.div>

      {/* 상자 오픈 애니메이션 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(false);
              setShowItem(false);
              setRewardItem(null);
            }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence>
                {!showItem ? (
                  <motion.div
                    key="opening"
                    className="space-y-6"
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="text-8xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      📦
                    </motion.div>
                    <div>
                      <motion.h3
                        className="text-2xl font-bold text-gray-800 mb-2"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        상자가 열리고 있습니다...
                      </motion.h3>
                      <motion.p
                        className="text-gray-600"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        ✨ 잠시만 기다려주세요 ✨
                      </motion.p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="revealed"
                    className="space-y-6"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* 레어도 배지 */}
                    <motion.div
                      className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                        rewardItem?.rarity === 'common' ? 'bg-gray-200 text-gray-800' :
                        rewardItem?.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                        rewardItem?.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                        'bg-amber-200 text-amber-800'
                      }`}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {rewardItem?.rarity === 'common' && '일반'}
                      {rewardItem?.rarity === 'rare' && '레어'}
                      {rewardItem?.rarity === 'epic' && '에픽'}
                      {rewardItem?.rarity === 'legendary' && '레전더리'}
                    </motion.div>

                    {/* 아이템 프리뷰 */}
                    <motion.div
                      className={`w-32 h-32 mx-auto rounded-2xl border-4 flex items-center justify-center overflow-hidden ${
                        rewardItem ? rarityColors[rewardItem.rarity] : ''
                      } ${rewardItem ? rarityEffects[rewardItem.rarity] : ''}`}
                      style={
                        rewardItem?.category === 'theme'
                          ? { background: rewardItem.previewData['--accent'] || '#3E94E4' }
                          : {}
                      }
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.4 }}
                    >
                      <span className="text-4xl">
                        {rewardItem?.category === 'theme' ? '🎨' :
                         rewardItem?.category === 'font' ? '✍️' :
                         rewardItem?.category === 'sticker' ? '🐱' :
                         rewardItem?.category === 'checkAnimation' ? '✨' :
                         rewardItem?.category === 'progressBar' ? '📊' : '🎁'}
                      </span>
                    </motion.div>

                    {/* 아이템 정보 */}
                    <div>
                      <motion.p
                        className="text-xs text-gray-500 mb-1"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.55 }}
                      >
                        {rewardItem?.category === 'theme' ? '테마' :
                         rewardItem?.category === 'font' ? '폰트' :
                         rewardItem?.category === 'sticker' ? '스티커' :
                         rewardItem?.category === 'checkAnimation' ? '체크 애니메이션' :
                         rewardItem?.category === 'progressBar' ? '프로그레스 바' : '아이템'}
                      </motion.p>
                      <motion.h3
                        className="text-2xl font-bold text-gray-800 mb-1"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {rewardItem?.nameKo}
                      </motion.h3>
                    </div>

                    {/* 닫기 버튼 */}
                    <motion.button
                      onClick={() => {
                        setIsOpen(false);
                        setShowItem(false);
                        setRewardItem(null);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-cat-purple to-cat-pink text-white rounded-xl font-bold"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      획득!
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
