import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CuteCatIllustration } from '../components/CuteCatIllustration';
import { useUser } from '../hooks';

interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: number;
  completed: number;
}

export function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: '운동하기', icon: '💪', frequency: 3, completed: 2 },
    { id: '2', name: '독서하기', icon: '📚', frequency: 5, completed: 4 },
    { id: '3', name: '명상하기', icon: '🧘', frequency: 7, completed: 3 },
  ]);

  // 인증되지 않은 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleCheckIn = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId && habit.completed < habit.frequency) {
        return { ...habit, completed: habit.completed + 1 };
      }
      return habit;
    }));
  };

  const handleUncheck = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId && habit.completed > 0) {
        return { ...habit, completed: habit.completed - 1 };
      }
      return habit;
    }));
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 page-enter">
      {/* 상단: 헤더 with 레벨 & 스트릭 */}
      <motion.div
        className="pt-6 pb-4 px-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="level-badge text-lg">
              {user?.level || 1}
            </div>
            <div>
              <h1 className="font-display text-xl text-cozy-brown-dark">
                {user?.username || '냥이집사'}
              </h1>
              <p className="text-sm text-cozy-brown opacity-75">오늘도 화이팅!</p>
            </div>
          </div>
          <div className="streak-badge">
            <span>🔥</span>
            <span>{user?.streak || 0}일</span>
          </div>
        </div>

        {/* EXP 프로그레스 바 */}
        <div className="progress-bar progress-bar-cat">
          <motion.div
            className="progress-fill progress-fill-cat"
            initial={{ width: 0 }}
            animate={{ width: `${((user?.exp || 0) % 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-cozy-brown mt-1 text-center font-heading">
          EXP: {user?.exp || 0} / {(user?.level || 1) * 100}
        </p>
      </motion.div>

      {/* 중간: 고양이 일러스트 */}
      <motion.div
        className="flex-1 flex items-center justify-center py-2 relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="animate-float">
          <CuteCatIllustration size="lg" />
        </div>
        {/* 말풍선 */}
        <motion.div
          className="absolute top-4 right-8 bg-cozy-paper border-3 border-cozy-brown-light rounded-2xl px-4 py-2 shadow-cozy"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          style={{ borderWidth: '3px' }}
        >
          <p className="font-heading text-sm text-cozy-brown-dark">
            오늘도 힘내라냥! 🐾
          </p>
          <div
            className="absolute -bottom-2 left-6 w-4 h-4 bg-cozy-paper border-b-3 border-r-3 border-cozy-brown-light transform rotate-45"
            style={{ borderWidth: '0 3px 3px 0' }}
          />
        </motion.div>
      </motion.div>

      {/* 하단: 트래커 목록과 버튼 */}
      <motion.div
        className="px-4 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* 트래커 목록 */}
        <div className="card">
          <h3 className="font-display text-lg mb-4 text-cozy-brown-dark flex items-center gap-2">
            <span className="animate-wiggle inline-block">📅</span>
            나의 트래커
          </h3>
          <div className="space-y-3">
            {habits.map((habit, index) => {
              const progress = (habit.completed / habit.frequency) * 100;
              const isComplete = habit.completed >= habit.frequency;
              return (
                <motion.div
                  key={habit.id}
                  className={`card-habit ${isComplete ? 'opacity-80' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, rotate: 0.5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{habit.icon}</span>
                      <span className="font-heading font-semibold text-cozy-brown-dark">
                        {habit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-cozy-cream px-2 py-1 rounded-full border-2 border-cozy-brown-light">
                      <span className="font-display text-sm text-cozy-brown-dark">
                        {habit.completed}
                      </span>
                      <span className="text-cozy-brown-light">/</span>
                      <span className="font-display text-sm text-cozy-brown">
                        {habit.frequency}
                      </span>
                    </div>
                  </div>

                  {/* 프로그레스 바 */}
                  <div className="progress-bar progress-bar-cat h-4 mb-3">
                    <motion.div
                      className={`progress-fill ${isComplete ? 'bg-gradient-to-r from-game-success to-cozy-sage' : 'progress-fill-cat'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    />
                  </div>

                  {/* 체크 버튼 */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleUncheck(habit.id)}
                      disabled={habit.completed === 0}
                      className="btn-icon flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                      whileTap={{ scale: 0.9 }}
                    >
                      ➖
                    </motion.button>
                    <motion.button
                      onClick={() => handleCheckIn(habit.id)}
                      disabled={isComplete}
                      className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold transition-all ${
                        isComplete
                          ? 'bg-cozy-cream border-3 border-game-success text-game-success cursor-default'
                          : 'btn-primary'
                      }`}
                      style={{ borderWidth: isComplete ? '3px' : undefined }}
                      whileTap={isComplete ? {} : { scale: 0.95 }}
                    >
                      {isComplete ? '✨ 완료!' : '✅ 체크하기'}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={() => navigate('/habits')}
            className="btn-primary text-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="block text-2xl mb-1">✅</span>
            <span className="font-heading text-sm">습관 관리</span>
          </motion.button>
          <motion.button
            onClick={() => navigate('/cat-room')}
            className="btn-cat text-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="block text-2xl mb-1">🏠</span>
            <span className="font-heading text-sm">고양이 방</span>
          </motion.button>
        </div>

        {/* 안내 메시지 */}
        <motion.div
          className="text-center py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-cozy-brown font-body">
            🐱 고양이와 함께 습관을 만들어보세요!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
