import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HabitData {
  id: string;
  name: string;
  icon: string;
  target: number;
  completed: number;
  checkedDays: boolean[];
}

export function Habits() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [habits, setHabits] = useState<HabitData[]>([
    { id: '1', name: '운동하기', icon: '🏃', target: 3, completed: 2, checkedDays: [true, true, false, false, false, false, false] },
    { id: '2', name: '독서하기', icon: '📚', target: 5, completed: 4, checkedDays: [true, true, true, true, false, false, false] },
  ]);

  const days = ['월', '화', '수', '목', '금', '토', '일'];

  const toggleDay = (habitId: string, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCheckedDays = [...habit.checkedDays];
        newCheckedDays[dayIndex] = !newCheckedDays[dayIndex];
        const newCompleted = newCheckedDays.filter(Boolean).length;
        return { ...habit, checkedDays: newCheckedDays, completed: newCompleted };
      }
      return habit;
    }));
  };

  const activeHabits = habits.filter(h => h.completed < h.target);
  const completedHabits = habits.filter(h => h.completed >= h.target);

  return (
    <div className="p-4 pb-24 space-y-5 page-enter">
      {/* 페이지 헤더 */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce-soft">✅</span>
          <h2 className="font-display text-2xl text-cozy-brown-dark">내 습관</h2>
        </div>
        <motion.button
          className="btn-primary py-2 px-4 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + 추가
        </motion.button>
      </motion.div>

      {/* 탭 */}
      <motion.div
        className="flex bg-cozy-cream rounded-2xl p-1 border-3 border-cozy-brown-light"
        style={{ borderWidth: '3px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.button
          className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
            activeTab === 'active'
              ? 'bg-cozy-orange text-white shadow-md'
              : 'text-cozy-brown hover:bg-cozy-paper'
          }`}
          onClick={() => setActiveTab('active')}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mr-1">🔥</span> 진행 중 ({activeHabits.length})
        </motion.button>
        <motion.button
          className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
            activeTab === 'completed'
              ? 'bg-game-success text-white shadow-md'
              : 'text-cozy-brown hover:bg-cozy-paper'
          }`}
          onClick={() => setActiveTab('completed')}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mr-1">🏆</span> 완료됨 ({completedHabits.length})
        </motion.button>
      </motion.div>

      {/* 습관 목록 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="space-y-4"
          initial={{ opacity: 0, x: activeTab === 'active' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'active' ? 20 : -20 }}
          transition={{ duration: 0.25 }}
        >
          {(activeTab === 'active' ? activeHabits : completedHabits).length > 0 ? (
            (activeTab === 'active' ? activeHabits : completedHabits).map((habit, index) => (
              <motion.div
                key={habit.id}
                className="card-habit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01, rotate: 0.3 }}
              >
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="text-3xl"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: index * 0.5 }}
                    >
                      {habit.icon}
                    </motion.span>
                    <div>
                      <h3 className="font-display text-lg text-cozy-brown-dark">{habit.name}</h3>
                      <p className="text-sm text-cozy-brown font-body">주 {habit.target}회 목표</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      className="btn-icon w-10 h-10 text-sm"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✏️
                    </motion.button>
                    <motion.button
                      className="btn-icon w-10 h-10 text-sm border-red-300"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      🗑️
                    </motion.button>
                  </div>
                </div>

                {/* 주간 진행률 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cozy-brown font-body">이번 주 진행률</span>
                    <div className="flex items-center gap-1 bg-cozy-cream px-3 py-1 rounded-full border-2 border-cozy-brown-light">
                      <span className="font-display text-cozy-brown-dark">{habit.completed}</span>
                      <span className="text-cozy-brown-light">/</span>
                      <span className="font-display text-cozy-brown">{habit.target}</span>
                    </div>
                  </div>

                  <div className="progress-bar progress-bar-cat h-5">
                    <motion.div
                      className={`progress-fill ${habit.completed >= habit.target ? 'bg-gradient-to-r from-game-success to-cozy-sage' : 'progress-fill-cat'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((habit.completed / habit.target) * 100, 100)}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    />
                  </div>

                  {/* 요일별 체크박스 */}
                  <div className="grid grid-cols-7 gap-2 mt-4">
                    {days.map((day, dayIndex) => (
                      <motion.button
                        key={day}
                        onClick={() => toggleDay(habit.id, dayIndex)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-heading font-semibold transition-all border-3 ${
                          habit.checkedDays[dayIndex]
                            ? 'bg-cozy-orange text-white border-cozy-orange-dark shadow-md'
                            : 'bg-cozy-cream text-cozy-brown border-cozy-brown-light hover:border-cozy-orange'
                        }`}
                        style={{ borderWidth: '3px' }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span>{day}</span>
                        {habit.checkedDays[dayIndex] && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-base mt-0.5"
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="card text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-5xl block mb-4">
                {activeTab === 'active' ? '🎉' : '😺'}
              </span>
              <p className="font-heading text-cozy-brown">
                {activeTab === 'active'
                  ? '모든 습관을 완료했어요!'
                  : '아직 완료된 습관이 없어요'}
              </p>
              <p className="text-sm text-cozy-brown-light mt-2 font-body">
                {activeTab === 'active'
                  ? '새로운 습관을 만들어보세요'
                  : '습관을 꾸준히 실천해보세요'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 습관 추가 버튼 */}
      <motion.button
        className="w-full btn-cat text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="mr-2">✨</span>
        새 습관 만들기
      </motion.button>
    </div>
  );
}