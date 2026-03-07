import { motion, AnimatePresence } from 'framer-motion';
import type { LocalUser } from '../../types';

interface ProfileHeaderProps {
  user: LocalUser;
  showLevelUp: boolean;
}

export function ProfileHeader({ user, showLevelUp }: ProfileHeaderProps) {
  return (
    <motion.div
      className="card-reward text-center relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background decorations */}
      <div className="absolute top-2 left-4 text-2xl opacity-30 animate-float" aria-hidden="true">✨</div>
      <div className="absolute top-4 right-6 text-xl opacity-30 animate-sparkle" aria-hidden="true">⭐</div>
      <div className="absolute bottom-3 left-8 text-lg opacity-30 animate-wiggle" aria-hidden="true">🌸</div>

      <motion.div
        className="relative w-24 h-24 mx-auto mb-4"
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Avatar frame */}
        <div
          className="absolute inset-0 rounded-full border-4 border-game-gold"
          style={{ boxShadow: '0 4px 0 var(--cozy-brown-dark), 0 0 20px rgba(212, 175, 55, 0.3)' }}
          aria-hidden="true"
        />
        <div
          className="w-full h-full rounded-full bg-gradient-to-br from-cozy-orange-light to-cozy-orange flex items-center justify-center text-5xl"
          role="img"
          aria-label="프로필 아바타"
        >
          🐱
        </div>
        {/* Level badge */}
        <div className="level-badge absolute -bottom-1 -right-1 w-10 h-10 text-base" aria-label={`레벨 ${user.level}`}>
          {user.level}
        </div>
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, transparent 70%)' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2 }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <h2 className="font-display text-2xl text-cozy-brown-dark mb-1">
        {user.username}
      </h2>
      <p className="text-sm text-cozy-brown font-body" role="status" aria-live="polite">
        {showLevelUp ? '🎉 레벨업! 🎉' : '습관의 달인을 향해 성장 중!'}
      </p>

      {/* Streak badge */}
      <motion.div
        className="streak-badge mt-4 inline-flex"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-label={`${user.streak}일 연속 달성`}
      >
        <span aria-hidden="true">🔥</span>
        <span>{user.streak}일 연속</span>
      </motion.div>
    </motion.div>
  );
}
