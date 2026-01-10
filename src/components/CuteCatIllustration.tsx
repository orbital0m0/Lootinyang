import { motion } from 'framer-motion';

interface CuteCatIllustrationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function CuteCatIllustration({ className = '', size = 'lg', animate = true }: CuteCatIllustrationProps) {
  const sizeMap = {
    sm: { width: 80, height: 80 },
    md: { width: 150, height: 150 },
    lg: { width: 250, height: 250 },
  };

  const { width, height } = sizeMap[size];

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        initial={{ rotate: -5 }}
        animate={animate ? {
          rotate: [-5, 5, -5],
          y: [0, -5, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="drop-shadow-lg"
      >
        {/* 꽃 장식 */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          {/* 왼쪽 꽃 */}
          <g transform="translate(20, 120)">
            <circle cx="0" cy="-8" r="6" fill="#FFB6C1" />
            <circle cx="-8" cy="0" r="6" fill="#FFB6C1" />
            <circle cx="8" cy="0" r="6" fill="#FFB6C1" />
            <circle cx="0" cy="0" r="5" fill="#FFD700" />
          </g>
          {/* 오른쪽 꽃 */}
          <g transform="translate(180, 130)">
            <circle cx="0" cy="-8" r="6" fill="#FFB6C1" />
            <circle cx="-8" cy="0" r="6" fill="#FFB6C1" />
            <circle cx="8" cy="0" r="6" fill="#FFB6C1" />
            <circle cx="0" cy="0" r="5" fill="#FFD700" />
          </g>
        </motion.g>

        {/* 몸통 */}
        <ellipse cx="100" cy="150" rx="50" ry="45" fill="#FFB6C1" />
        <ellipse cx="100" cy="145" rx="30" ry="25" fill="#FFC0CB" />

        {/* 꼬리 */}
        <motion.path
          d="M 50 150 Q 30 130 40 110 Q 50 90 60 110"
          stroke="#FFB6C1"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          animate={{
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* 머리 */}
        <circle cx="100" cy="90" r="55" fill="#FFB6C1" />

        {/* 귀 */}
        <g>
          {/* 왼쪽 귀 */}
          <path d="M 55 55 L 45 20 L 75 45 Z" fill="#FFB6C1" />
          <path d="M 58 50 L 52 28 L 70 46 Z" fill="#FFD9E6" />
          <motion.ellipse
            cx="62"
            cy="42"
            rx="3"
            ry="5"
            fill="#FFB6C1"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 오른쪽 귀 */}
          <path d="M 145 55 L 155 20 L 125 45 Z" fill="#FFB6C1" />
          <path d="M 142 50 L 148 28 L 130 46 Z" fill="#FFD9E6" />
          <motion.ellipse
            cx="138"
            cy="42"
            rx="3"
            ry="5"
            fill="#FFB6C1"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          />
        </g>

        {/* 눈 */}
        <g>
          {/* 왼쪽 눈 */}
          <motion.g
            animate={{
              y: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ellipse cx="75" cy="85" rx="12" ry="14" fill="#2C3E50" />
            <circle cx="73" cy="82" r="4" fill="#FFFFFF" />
            <circle cx="77" cy="88" r="2" fill="#FFFFFF" opacity={0.5} />
          </motion.g>

          {/* 오른쪽 눈 */}
          <motion.g
            animate={{
              y: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.1,
            }}
          >
            <ellipse cx="125" cy="85" rx="12" ry="14" fill="#2C3E50" />
            <circle cx="123" cy="82" r="4" fill="#FFFFFF" />
            <circle cx="127" cy="88" r="2" fill="#FFFFFF" opacity={0.5} />
          </motion.g>
        </g>

        {/* 눈썹 */}
        <g>
          <path d="M 60 70 Q 75 65 85 72" stroke="#FFB6C1" strokeWidth="2" fill="none" />
          <path d="M 115 72 Q 125 65 140 70" stroke="#FFB6C1" strokeWidth="2" fill="none" />
        </g>

        {/* 코 */}
        <ellipse cx="100" cy="105" rx="6" ry="4" fill="#FF6B9D" />
        <motion.ellipse
          cx="97"
          cy="104"
          rx="1.5"
          ry="1"
          fill="#FF8FB3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="103"
          cy="104"
          rx="1.5"
          ry="1"
          fill="#FF8FB3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
        />

        {/* 입 */}
        <motion.path
          d="M 100 109 L 95 115 L 100 112 L 105 115 Z"
          fill="#FF6B9D"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* 볼 털 */}
        <g fill="#FFD9E6" opacity="0.6">
          <circle cx="60" cy="100" r="4" />
          <circle cx="65" cy="105" r="3" />
          <circle cx="140" cy="100" r="4" />
          <circle cx="135" cy="105" r="3" />
        </g>

        {/* 앞발 */}
        <g>
          <ellipse cx="80" cy="170" rx="12" ry="10" fill="#FFB6C1" />
          <ellipse cx="80" cy="172" rx="10" ry="8" fill="#FFD9E6" />
          <ellipse cx="120" cy="170" rx="12" ry="10" fill="#FFB6C1" />
          <ellipse cx="120" cy="172" rx="10" ry="8" fill="#FFD9E6" />
        </g>

        {/* 하트 장식 */}
        <motion.g
          transform="translate(100, 40)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path
            d="M 0 -5 C -10 -15, -10 5, 0 12 C 10 5, 10 -15, 0 -5"
            fill="#FF69B4"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
