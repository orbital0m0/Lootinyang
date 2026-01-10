import { motion } from 'framer-motion';

export function Logo() {
  return (
    <motion.div
      className="text-center"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <motion.h1
        className="text-3xl font-bold bg-gradient-to-r from-cat-orange to-cat-pink bg-clip-text text-transparent"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        Lootinyang
      </motion.h1>
      <motion.p
        className="text-sm text-gray-600 mt-1"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🐱 습관 형성을 위한 나만의 고양이 🐱
      </motion.p>
    </motion.div>
  );
}
