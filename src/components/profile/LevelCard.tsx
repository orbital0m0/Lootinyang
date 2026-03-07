import { motion } from 'framer-motion';
import { LevelProgressBar } from '../LevelProgressBar';

interface LevelCardProps {
  level: number;
  exp: number;
  expToNext: number;
  showLevelUp: boolean;
}

export function LevelCard({ level, exp, expToNext, showLevelUp }: LevelCardProps) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
        <span className="animate-bounce-soft inline-block" aria-hidden="true">📊</span>
        레벨 정보
      </h3>
      <LevelProgressBar
        level={level}
        currentExp={exp}
        expToNextLevel={expToNext}
        showLevelUp={showLevelUp}
        size="md"
      />
    </motion.div>
  );
}
