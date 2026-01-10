import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';
import { CuteCatIllustration } from '../components/CuteCatIllustration';
import { useUser } from '../hooks';

interface Habit {
  id: string;
  name: string;
  frequency: number;
  completed: number;
}

export function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: '운동하기', frequency: 3, completed: 2 },
    { id: '2', name: '독서하기', frequency: 5, completed: 4 },
    { id: '3', name: '명상하기', frequency: 7, completed: 3 },
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
    <div className="flex flex-col min-h-screen pb-24">
      {/* 상단: 로고 */}
      <motion.div
        className="pt-8 pb-4 px-4 bg-gradient-to-b from-orange-50 to-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo />
      </motion.div>

      {/* 중간: 고양이 일러스트 */}
      <motion.div
        className="flex-1 flex items-center justify-center py-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CuteCatIllustration size="lg" />
      </motion.div>

      {/* 하단: 트래커 목록과 버튼 */}
      <motion.div
        className="px-4 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* 트래커 목록 */}
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">📅 나의 트래커</h3>
          <div className="space-y-3">
            {habits.map((habit, index) => {
              const progress = (habit.completed / habit.frequency) * 100;
              return (
                <motion.div
                  key={habit.id}
                  className="p-3 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-orange-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{habit.name}</span>
                    <span className="text-sm text-gray-600">
                      {habit.completed}/{habit.frequency}회
                    </span>
                  </div>

                  {/* 프로그레스 바 */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <motion.div
                      className="h-2.5 rounded-full bg-gradient-to-r from-cat-orange to-cat-pink"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    />
                  </div>

                  {/* 체크 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUncheck(habit.id)}
                      disabled={habit.completed === 0}
                      className="flex-1 py-2 px-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ➖
                    </button>
                    <button
                      onClick={() => handleCheckIn(habit.id)}
                      disabled={habit.completed >= habit.frequency}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        habit.completed >= habit.frequency
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cat-orange to-cat-pink text-white hover:shadow-lg'
                      }`}
                    >
                      ✅ 체크
                    </button>
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
            className="btn-primary py-4 text-lg font-bold shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            ✅ 달성 확인
          </motion.button>
          <motion.button
            onClick={() => navigate('/cat-room')}
            className="btn-secondary py-4 text-lg font-bold shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 고양이 방
          </motion.button>
        </div>

        {/* 안내 메시지 */}
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-gray-500">
            🐱 고양이와 함께 습관을 만들어보세요!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
