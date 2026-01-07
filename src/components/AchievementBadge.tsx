import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  progress?: number;
  isUnlocked?: boolean;
  onUnlock?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({
  achievement,
  progress = 0,
  isUnlocked = false,
  onUnlock,
  size = 'md',
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: {
      container: 'p-2',
      icon: 'text-xl',
      title: 'text-sm',
      description: 'text-xs',
      progressHeight: 'h-1',
    },
    md: {
      container: 'p-3',
      icon: 'text-2xl',
      title: 'text-base',
      description: 'text-sm',
      progressHeight: 'h-2',
    },
    lg: {
      container: 'p-4',
      icon: 'text-3xl',
      title: 'text-lg',
      description: 'text-base',
      progressHeight: 'h-3',
    },
  };

  const { container, icon, title, description, progressHeight } = sizeClasses[size];

  const rarityColors = {
    common: {
      badge: 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300',
      progress: 'bg-gray-500',
      text: 'text-gray-800',
      shadow: 'shadow-gray-200',
    },
    rare: {
      badge: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300',
      progress: 'bg-blue-500',
      text: 'text-blue-800',
      shadow: 'shadow-blue-200',
    },
    epic: {
      badge: 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300',
      progress: 'bg-purple-500',
      text: 'text-purple-800',
      shadow: 'shadow-purple-200',
    },
    legendary: {
      badge: 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300',
      progress: 'bg-amber-500',
      text: 'text-amber-800',
      shadow: 'shadow-amber-200',
    },
  };

  const rarityTheme = rarityColors[achievement.badge_color as keyof typeof rarityColors] || rarityColors.common;

  return (
    <motion.div
      className={`card-achievement relative overflow-hidden ${container} ${rarityTheme.badge} border-2`}
      whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 배지 아이콘 */}
      <motion.div
        className={`${icon} mb-2`}
        animate={isUnlocked ? {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: isUnlocked ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {achievement.icon}
      </motion.div>

      {/* 업적 제목 */}
      <h4 className={`font-medium mb-1 ${rarityTheme.text} ${title}`}>
        {achievement.name}
      </h4>

      {/* 업적 설명 */}
      <p className={`text-gray-600 mb-2 ${description}`}>
        {achievement.description}
      </p>

      {/* 조건 */}
      <p className={`text-xs text-gray-500 mb-2 ${description}`}>
        조건: {achievement.condition}
      </p>

      {/* 포인트 */}
      <div className={`text-sm font-medium ${rarityTheme.text} mb-2`}>
        ⭐ {achievement.points} 포인트
      </div>

      {/* 진행 바 (잠긴 업적일 때) */}
      {!isUnlocked && progress > 0 && (
        <div>
          <motion.div
            className={`w-full bg-white/50 rounded-full overflow-hidden ${progressHeight}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className={`h-full ${rarityTheme.progress} relative`}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="absolute inset-0 bg-white/30" />
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* 잠금 상태 (잠긴 업적일 때) */}
      {!isUnlocked && progress === 0 && (
        <motion.div
          className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg"
          whileHover={{ opacity: 0 }}
        >
          <span className="text-2xl">🔒</span>
        </motion.div>
      )}

      {/* 완료 뱃지 (잠긴 해제된 업적일 때) */}
      {isUnlocked && (
        <motion.div
          className="absolute top-1 right-1"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
            delay: 0.2,
          }}
        >
          <motion.span
            className="text-lg"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✅
          </motion.span>
        </motion.div>
      )}

      {/* 업적 달성 파티클 효과 */}
      <AnimatePresence>
        {isUnlocked && onUnlock && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xl"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1.5,
                  x: Math.cos((i * 30 * Math.PI) / 180) * 80,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 80,
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.05,
                }}
              >
                {['✨', '🎉', '🎊', '⭐', '🌟', '💫'][i % 6]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
