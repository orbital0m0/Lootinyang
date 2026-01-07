import { motion, AnimatePresence } from 'framer-motion';

interface LevelProgressBarProps {
  level: number;
  currentExp: number;
  expToNextLevel: number;
  showLevelUp?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LevelProgressBar({
  level,
  currentExp,
  expToNextLevel,
  showLevelUp = false,
  size = 'md',
}: LevelProgressBarProps) {
  const progress = (currentExp / expToNextLevel) * 100;

  const sizeClasses = {
    sm: {
      barHeight: 'h-2',
      labelSize: 'text-xs',
      levelSize: 'text-sm',
    },
    md: {
      barHeight: 'h-3',
      labelSize: 'text-sm',
      levelSize: 'text-base',
    },
    lg: {
      barHeight: 'h-4',
      labelSize: 'text-base',
      levelSize: 'text-lg',
    },
  };

  const { barHeight, labelSize, levelSize } = sizeClasses[size];

  return (
    <div className="space-y-2">
      {/* 레벨 정보 */}
      <div className={`flex justify-between ${labelSize}`}>
        <motion.span
          className={`font-bold ${levelSize}`}
          animate={showLevelUp ? {
            scale: [1, 1.5, 1],
            rotate: [0, 10, -10, 0],
          } : {}}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
        >
          Level {level}
        </motion.span>
        <span className="text-gray-500">
          {currentExp}/{expToNextLevel} EXP
        </span>
      </div>

      {/* 진행 바 */}
      <div className="relative">
        {/* 배경 */}
        <div className={`w-full ${barHeight} bg-gray-200 rounded-full overflow-hidden`}>
          {/* 채워진 부분 */}
          <motion.div
            className="h-full bg-gradient-to-r from-cat-orange via-cat-pink to-cat-purple rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{
              duration: 1,
              ease: 'easeInOut',
            }}
          >
            {/* 애니메이션 효과 */}
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        </div>

        {/* 텍스트 오버레이 (lg 사이즈일 때) */}
        {size === 'lg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className={`font-bold text-white ${labelSize}`}
              animate={{
                opacity: progress > 10 ? 1 : 0,
              }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        )}
      </div>

      {/* 레벨업 효과 */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 2 }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1.5,
                  x: Math.cos((i * 45 * Math.PI) / 180) * 100,
                  y: Math.sin((i * 45 * Math.PI) / 180) * 100,
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.05,
                }}
              >
                {['✨', '🎉', '🎊'][i % 3]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
