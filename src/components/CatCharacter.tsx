import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 고양이 캐릭터 감정 상태
export type CatMood = 'happy' | 'normal' | 'sleepy' | 'excited';

// 이벤트 기반 리액션 타입
export type CatReaction = 'check_complete' | 'level_up' | 'reward' | 'streak' | null;

// 고양이 캐릭터 props
interface CatCharacterProps {
  mood?: CatMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onMoodChange?: (mood: CatMood) => void;
  triggerReaction?: CatReaction;
  streakCount?: number;
}

// 리액션별 설정
const REACTION_CONFIG: Record<NonNullable<CatReaction>, {
  emoji: string;
  moodOverride: CatMood;
  scale: number;
  duration: number;
}> = {
  check_complete: { emoji: '💖', moodOverride: 'happy', scale: 1.0, duration: 1500 },
  level_up: { emoji: '⭐', moodOverride: 'excited', scale: 1.3, duration: 2000 },
  reward: { emoji: '🎁', moodOverride: 'excited', scale: 1.1, duration: 1800 },
  streak: { emoji: '🔥', moodOverride: 'happy', scale: 1.05, duration: 1500 },
};

// 고양이 캐릭터 컴포넌트
export function CatCharacter({ mood = 'normal', size = 'md', className = '', onMoodChange, triggerReaction = null, streakCount }: CatCharacterProps) {
  const [activeReaction, setActiveReaction] = useState<CatReaction>(null);
  const [reactionKey, setReactionKey] = useState(0);
  const [prevTrigger, setPrevTrigger] = useState<CatReaction>(null);

  // React-documented pattern: adjust state during render when prop changes
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (triggerReaction !== prevTrigger) {
    setPrevTrigger(triggerReaction);
    if (triggerReaction) {
      setActiveReaction(triggerReaction);
      setReactionKey(reactionKey + 1);
    }
  }

  // Auto-dismiss timer (setState in async callback is allowed)
  useEffect(() => {
    if (!activeReaction) return;
    const config = REACTION_CONFIG[activeReaction];
    const timer = setTimeout(() => {
      setActiveReaction(null);
    }, config.duration);
    return () => clearTimeout(timer);
  }, [activeReaction]);

  // 리액션이 활성화되면 mood를 오버라이드
  const effectiveMood = activeReaction ? REACTION_CONFIG[activeReaction].moodOverride : mood;
  const reactionScale = activeReaction ? REACTION_CONFIG[activeReaction].scale : 1;
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const moodClasses = {
    happy: 'animate-bounce-slow',
    normal: '',
    sleepy: 'opacity-75',
    excited: 'animate-pulse-slow',
  };

  const eyeClasses = {
    happy: 'scale-125',
    normal: 'scale-100',
    sleepy: 'scale-50',
    excited: 'scale-150',
  };

  const mouthClasses = {
    happy: 'w-6 h-2',
    normal: 'w-4 h-1.5',
    sleepy: 'w-3 h-1',
    excited: 'w-7 h-2.5',
  };

  const accessoryClasses = {
    happy: 'translate-y-[-4px] translate-x-1/2 scale-150',
    normal: 'translate-y-[-2px] translate-x-1/2 scale-100',
    sleepy: 'translate-y-[0px] translate-x-1/2 scale-75',
    excited: 'translate-y-[-6px] translate-x-1/2 scale-200',
  };

  const faceAnimation = {
    happy: {
      scale: [1, 1.05, 1],
      rotate: [0, 3, -3, 0],
    },
    normal: {
      scale: 1,
      rotate: 0,
    },
    sleepy: {
      scale: [1, 0.98, 1],
      y: [0, 3, 0],
    },
    excited: {
      scale: [1, 1.1, 1],
      rotate: [0, 8, -8, 0],
    },
  };

  const earLeftAnimation = effectiveMood === 'happy' ? {
    rotate: [-12, -6, -12],
  } : {
    rotate: -12,
  };

  const earRightAnimation = effectiveMood === 'happy' ? {
    rotate: [12, 6, 12],
  } : {
    rotate: 12,
  };

  const eyeScale = effectiveMood === 'sleepy' ? 0.3 : 1;
  const pupilScale = effectiveMood === 'excited' ? 1.3 : 1;
  const mouthScale = effectiveMood === 'happy' ? 1.2 : 1;
  const tailRotation = effectiveMood === 'happy' ? [-10, 10, -10] : 0;

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* 리액션 이펙트 오버레이 */}
      <AnimatePresence>
        {activeReaction && (
          <motion.div
            key={`reaction-${reactionKey}`}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none"
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: -20, scale: 1.2 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-3xl">
              {REACTION_CONFIG[activeReaction].emoji}
            </span>
            {activeReaction === 'streak' && streakCount && (
              <span className="absolute -right-6 top-0 text-sm font-extrabold text-orange-500">
                {streakCount}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* level_up 파티클 이펙트 */}
      <AnimatePresence>
        {activeReaction === 'level_up' && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={`particle-${reactionKey}-${i}`}
                className="absolute top-1/2 left-1/2 text-xl pointer-events-none z-10"
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                animate={{
                  opacity: 0,
                  x: Math.cos((i * 72 * Math.PI) / 180) * 40,
                  y: Math.sin((i * 72 * Math.PI) / 180) * 40,
                  scale: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* 고양이 얼굴 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cat-orange to-cat-orange-dark rounded-full shadow-lg"
        animate={{
          ...faceAnimation[effectiveMood],
          scale: activeReaction
            ? [reactionScale, reactionScale * 0.95, reactionScale]
            : faceAnimation[effectiveMood].scale,
        }}
        transition={{
          duration: effectiveMood === 'happy' ? 1 : effectiveMood === 'sleepy' ? 2 : effectiveMood === 'excited' ? 0.5 : 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 왼쪽 귀 */}
        <motion.div
          className="absolute -top-3 -left-2 w-6 h-6 bg-cat-orange rounded-t-full"
          animate={earLeftAnimation}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transform: 'rotate(-12deg)' }}
        />

        {/* 오른쪽 귀 */}
        <motion.div
          className="absolute -top-3 -right-2 w-6 h-6 bg-cat-orange rounded-t-full"
          animate={earRightAnimation}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transform: 'rotate(12deg)' }}
        />

        {/* 왼쪽 눈 */}
        <motion.div
          className={`absolute top-8 left-6 w-3 h-4 bg-gray-800 rounded-full ${eyeClasses[effectiveMood]}`}
          animate={{ scaleY: eyeScale }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`absolute inset-1 bg-white rounded-full ${moodClasses[effectiveMood]}`}
            animate={{ scale: pupilScale }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-1 bg-gray-900 rounded-full w-1 h-1" />
          </motion.div>
        </motion.div>

        {/* 오른쪽 눈 */}
        <motion.div
          className={`absolute top-8 right-6 w-3 h-4 bg-gray-800 rounded-full ${eyeClasses[effectiveMood]}`}
          animate={{ scaleY: eyeScale }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`absolute inset-1 bg-white rounded-full ${moodClasses[effectiveMood]}`}
            animate={{ scale: pupilScale }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-1 bg-gray-900 rounded-full w-1 h-1" />
          </motion.div>
        </motion.div>

        {/* 코 */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full" />

        {/* 입 */}
        <motion.div
          className={`absolute top-14 left-1/2 transform -translate-x-1/2 border-b-2 border-gray-800 rounded-b-full ${mouthClasses[effectiveMood]}`}
          animate={{ scaleY: mouthScale }}
          transition={{ duration: 0.3 }}
        />

        {/* 졸린 때 하트 */}
        {effectiveMood === 'sleepy' && !activeReaction && (
          <motion.div
            className="absolute top-6 left-1/2 transform -translate-x-1/2 text-error-400 text-2xl"
            animate={{
              y: [0, -10, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="inline-block">💤</span>
          </motion.div>
        )}

        {/* 행복할 때 하트 */}
        {effectiveMood === 'happy' && !activeReaction && (
          <motion.div
            className="absolute top-6 left-1/2 transform -translate-x-1/2 text-pink-400 text-2xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="inline-block">💖</span>
          </motion.div>
        )}

        {/* 흥분할 때 하트 */}
        {effectiveMood === 'excited' && !activeReaction && (
          <motion.div
            className="absolute top-6 left-1/2 transform -translate-x-1/2 text-cat-pink-dark text-2xl"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 20, -20, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="inline-block">😸</span>
          </motion.div>
        )}
      </motion.div>

      {/* 꼬리 */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="w-3 h-8 bg-cat-orange rounded-full"
          style={{ transformOrigin: 'top center' }}
          animate={{ rotate: tailRotation }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* 꼬리 털 */}
          <div className="absolute -top-1 left-1/2 w-1 h-4 bg-cat-pink-dark rounded-full" />
        </motion.div>
      </div>

      {/* 감정 전환 버튼 */}
      <motion.button
        onClick={() => onMoodChange?.('happy')}
        className={`absolute -bottom-4 left-1/2 transform -translate-y-1/2 p-1.5 rounded-full ${accessoryClasses[effectiveMood]}`}
        aria-label="행복 상태 전환"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <span className="text-xl">😊</span>
      </motion.button>
    </div>
  );
}