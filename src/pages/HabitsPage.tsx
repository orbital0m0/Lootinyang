import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHabits, useDailyChecks, useUser } from '../hooks';
import type { Habit } from '../types';

const THEME_COLORS = [
  { id: 'blue', color: '#3E94E4', label: '파랑' },
  { id: 'pink', color: '#FF4D91', label: '핑크' },
  { id: 'orange', color: '#FF8C42', label: '오렌지' },
  { id: 'green', color: '#10B981', label: '초록' },
  { id: 'purple', color: '#8B5CF6', label: '보라' },
];

function getHabitIcon(name: string): string {
  if (name.includes('물') || name.includes('water')) return 'water_drop';
  if (name.includes('운동') || name.includes('헬스')) return 'fitness_center';
  if (name.includes('책') || name.includes('독서')) return 'menu_book';
  if (name.includes('명상') || name.includes('meditation')) return 'self_improvement';
  if (name.includes('달리기') || name.includes('걷기')) return 'directions_run';
  if (name.includes('식사') || name.includes('다이어트')) return 'restaurant';
  if (name.includes('수면') || name.includes('잠')) return 'bedtime';
  if (name.includes('코딩') || name.includes('공부')) return 'code';
  return 'check_circle';
}

export function HabitsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { habits, createHabit, deleteHabit, isCreating } = useHabits(user?.id);
  const { checkHabit, uncheckHabit, isTodayChecked, isDateChecked, getCheckedDatesThisWeek, isChecking } = useDailyChecks();

  const [showForm, setShowForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState(4);
  const [selectedColor, setSelectedColor] = useState('blue');

  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const today = new Date().toISOString().split('T')[0];

  const getWeeklyProgress = (habit: Habit) => {
    if (!habit.weekly_target) return 0;
    const thisWeekChecks = getCheckedDatesThisWeek(habit.id);
    return Math.min((thisWeekChecks.length / habit.weekly_target) * 100, 100);
  };

  const completionRate = habits.length > 0
    ? Math.round(habits.reduce((total, habit) => total + getWeeklyProgress(habit), 0) / habits.length)
    : 0;

  const handleCreateHabit = async () => {
    if (!newHabitName.trim() || !user?.id) return;
    await createHabit({
      user_id: user.id,
      name: newHabitName,
      weekly_target: newHabitFrequency,
      is_active: true,
    });
    setNewHabitName('');
    setNewHabitFrequency(4);
    setShowForm(false);
  };

  const handleToggleCheck = async (habitId: string, date?: string) => {
    const targetDate = date || today;
    const isChecked = date ? isDateChecked(habitId, date) : isTodayChecked(habitId);

    if (isChecked) {
      await uncheckHabit(habitId, targetDate);
    } else {
      await checkHabit(habitId, targetDate);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (window.confirm('정말로 이 습관을 삭제하시겠습니까?')) {
      await deleteHabit(habitId);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full max-w-[480px] mx-auto flex-col overflow-x-hidden bg-white pb-32 page-enter">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center bg-white/80 backdrop-blur-md p-4 pb-2 justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex size-12 shrink-0 items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          통계 및 업적
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-transparent hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-2xl">share</span>
          </button>
        </div>
      </div>

      {/* Weekly Achievement Chart */}
      <div className="px-4 pt-6">
        <div className="bg-accent-blue/30 rounded-xl p-6 border border-accent-blue">
          <div className="flex flex-col gap-1 mb-6">
            <p className="text-sm font-semibold text-primary">이번 주 성취도</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold tracking-tight">{completionRate}%</p>
              <p className="text-sm font-bold text-success-600 bg-success-50 px-2 py-0.5 rounded-full">
                +{Math.round(completionRate * 0.12)}%
              </p>
            </div>
          </div>

          {/* Weekly Bar Chart */}
          <div className="grid grid-cols-7 gap-3 items-end h-[120px] px-2">
            {weekDays.map((day, index) => {
              const date = weekDates[index];
              const dayCompletions = habits.filter(h => isDateChecked(h.id, date)).length;
              const percentage = habits.length > 0 ? (dayCompletions / habits.length) * 100 : 0;
              const isToday = date === today;

              return (
                <div key={day} className="flex flex-col items-center gap-2 group">
                  <motion.div
                    className={`w-full rounded-t-full transition-all duration-500 ${
                      isToday ? 'bg-primary' : 'bg-primary/20'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(percentage, 10)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                  <p className={`text-[11px] font-bold ${isToday ? 'text-primary' : 'text-gray-500'}`}>
                    {day}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Habits List Section */}
      <div className="flex items-center justify-between px-4 pb-3 pt-8">
        <h2 className="text-xl font-bold leading-tight tracking-tight">나의 습관</h2>
        <button
          onClick={() => setShowForm(true)}
          className="badge badge-primary"
        >
          + 새 습관 추가
        </button>
      </div>

      {/* Habits */}
      <div className="px-4 space-y-4 pb-6">
        {habits.length === 0 ? (
          <motion.div
            className="glass-card rounded-2xl p-8 ios-shadow text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">
              rocket_launch
            </span>
            <p className="text-slate-500 font-medium mb-1">
              작은 목표부터 시작해보세요!
            </p>
            <p className="text-slate-400 text-sm">
              예: 매일 물 2L 마시기
            </p>
          </motion.div>
        ) : (
          habits.map((habit, index) => {
            const progress = getWeeklyProgress(habit);
            const thisWeekChecks = getCheckedDatesThisWeek(habit.id);
            const iconName = getHabitIcon(habit.name);

            return (
              <motion.div
                key={habit.id}
                className="glass-card rounded-2xl p-5 ios-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Habit Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="icon-circle">
                    <span className="material-symbols-outlined text-2xl">{iconName}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1A1C1E] text-sm">{habit.name}</p>
                    <p className="text-[11px] text-slate-400">
                      주 {habit.weekly_target}회 목표
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#1A1C1E]">
                      {thisWeekChecks.length} / {habit.weekly_target}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-bold">
                      {progress >= 100 ? '완료!' : '진행중'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="text-slate-400 hover:text-error-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>

                {/* Weekly Check Dots */}
                <div className="flex justify-between mb-4">
                  {weekDays.map((day, dayIndex) => {
                    const date = weekDates[dayIndex];
                    const isChecked = isDateChecked(habit.id, date);
                    const isToday = date === today;
                    const isPast = new Date(date) < new Date(today);

                    return (
                      <button
                        key={day}
                        onClick={() => handleToggleCheck(habit.id, date)}
                        disabled={isChecking}
                        className="flex flex-col items-center gap-1"
                      >
                        <motion.div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-highlight text-white'
                              : isToday
                              ? 'bg-primary/10 border-2 border-primary text-primary'
                              : isPast
                              ? 'bg-slate-100 text-slate-400'
                              : 'bg-slate-50 text-slate-300'
                          }`}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isChecked ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            <span className="text-xs font-bold">{day}</span>
                          )}
                        </motion.div>
                      </button>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Habit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="bg-white rounded-t-3xl w-full max-w-[480px] p-6 pb-10"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <h3 className="text-lg font-bold">새 목표 만들기</h3>
                <div className="w-6" />
              </div>

              {/* Illustration */}
              <div className="flex justify-center mb-6">
                <div className="bg-primary/5 rounded-2xl p-6">
                  <span className="material-symbols-outlined text-6xl text-primary">
                    rocket_launch
                  </span>
                </div>
              </div>
              <p className="text-center text-primary font-semibold mb-6">
                작은 목표부터 시작해보세요!
              </p>

              {/* Form */}
              <div className="space-y-6">
                {/* Habit Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    어떤 목표를 세울까요?
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newHabitName}
                      onChange={e => setNewHabitName(e.target.value)}
                      placeholder="예: 매일 물 2L 마시기"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      edit
                    </span>
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    일주일에 몇 번 할까요?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(freq => (
                      <button
                        key={freq}
                        onClick={() => setNewHabitFrequency(freq)}
                        className={`py-3 rounded-xl font-bold text-sm transition-all ${
                          newHabitFrequency === freq
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {freq === 7 ? '매일' : `${freq}회`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Color */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    테마 컬러
                  </label>
                  <div className="flex gap-3">
                    {THEME_COLORS.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedColor(theme.id)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedColor === theme.id
                            ? 'ring-2 ring-offset-2 ring-slate-400'
                            : ''
                        }`}
                        style={{ backgroundColor: theme.color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleCreateHabit}
                  disabled={!newHabitName.trim() || isCreating}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#3E94E4' }}
                >
                  {isCreating ? '생성 중...' : '만들기'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Button */}
      {!showForm && (
        <motion.button
          onClick={() => setShowForm(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-highlight text-white rounded-full shadow-lg flex items-center justify-center z-40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </motion.button>
      )}
    </div>
  );
}
