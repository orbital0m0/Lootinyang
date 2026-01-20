import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHabits, useDailyChecks, useUser } from '../hooks';
import { HabitsList, HabitForm, HabitStatistics } from '../components/habits';
import type { Habit } from '../types';

export function HabitsPage() {
  const { user } = useUser();
  const { habits, createHabit, updateHabit, deleteHabit, isCreating } = useHabits(user?.id);
  const { checkHabit, uncheckHabit, isTodayChecked, isDateChecked, getCheckedDatesThisWeek, isChecking } = useDailyChecks();

  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [celebratingHabitId, setCelebratingHabitId] = useState<string | null>(null);

  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  // Calculate week dates
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

  const getWeeklyProgress = (habit: Habit) => {
    if (!habit.weekly_target) return 0;
    const thisWeekChecks = getCheckedDatesThisWeek(habit.id);
    return Math.min((thisWeekChecks.length / habit.weekly_target) * 100, 100);
  };

  const completionRate = habits.length > 0
    ? Math.round(habits.reduce((total, habit) => total + getWeeklyProgress(habit), 0) / habits.length)
    : 0;

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleCreateHabit = async (habitData: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => {
    await createHabit(habitData);
    handleCloseForm();
  };

  const handleUpdateHabit = async (habit: Habit) => {
    await updateHabit(habit.id, {
      name: habit.name,
      weekly_target: habit.weekly_target,
    });
    setEditingHabit(null);
    handleCloseForm();
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (window.confirm('정말로 이 습관을 삭제하시겠습니까?')) {
      await deleteHabit(habitId);
    }
  };

  const handleCheck = async (habitId: string, date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const isChecked = date ? isDateChecked(habitId, date) : isTodayChecked(habitId);

    if (isChecked) {
      await uncheckHabit(habitId, targetDate);
    } else {
      await checkHabit(habitId, targetDate);
      setCelebratingHabitId(habitId);
      setTimeout(() => setCelebratingHabitId(null), 2000);
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <span className="text-6xl animate-bounce-slow" aria-hidden="true">🐱</span>
        <h1 className="font-heading text-gray-800 mt-4">내 습관</h1>
      </div>

      {/* Statistics */}
      <HabitStatistics
        habitCount={habits.length}
        completionRate={completionRate}
        streak={user?.streak || 0}
      />

      {/* Habits List */}
      <HabitsList
        habits={habits}
        celebratingHabitId={celebratingHabitId}
        isChecking={isChecking}
        weekDates={weekDates}
        weekDays={weekDays}
        isTodayChecked={isTodayChecked}
        isDateChecked={isDateChecked}
        getWeeklyProgress={getWeeklyProgress}
        onCheck={handleCheck}
        onEdit={handleEdit}
        onDelete={handleDeleteHabit}
        onShowForm={() => setShowForm(true)}
      />

      {/* Floating Action Button */}
      {habits.length > 0 && !showForm && (
        <motion.button
          onClick={() => setShowForm(true)}
          className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-cat-orange to-cat-pink text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label="새 습관 추가"
        >
          <span aria-hidden="true">+</span>
        </motion.button>
      )}

      {/* Create/Edit Form Modal */}
      <HabitForm
        isOpen={showForm}
        editingHabit={editingHabit}
        isCreating={isCreating}
        userId={user?.id || ''}
        onClose={handleCloseForm}
        onSubmit={handleCreateHabit}
        onUpdate={handleUpdateHabit}
      />
    </div>
  );
}
