import { motion } from 'framer-motion';
import { LevelProgressBar } from '../LevelProgressBar';

interface LevelCardProps {
  level: number;
  exp: number;
  expToNext: number;
  showLevelUp: boolean;
  onLevelUpTest: () => void;
}

export function LevelCard({ level, exp, expToNext, showLevelUp, onLevelUpTest }: LevelCardProps) {
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
      <motion.button
        onClick={onLevelUpTest}
        className="w-full btn-cat mt-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="레벨업 테스트 실행"
      >
        <span className="mr-2" aria-hidden="true">🎯</span> 레벨업 테스트
      </motion.button>
    </motion.div>
  );
}
