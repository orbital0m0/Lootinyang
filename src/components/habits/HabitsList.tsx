import type { Habit } from '../../types';
import { HabitCard } from './HabitCard';

interface HabitsListProps {
  habits: Habit[];
  celebratingHabitId: string | null;
  isChecking: boolean;
  weekDates: string[];
  weekDays: string[];
  isTodayChecked: (habitId: string) => boolean;
  isDateChecked: (habitId: string, date: string) => boolean;
  getWeeklyProgress: (habit: Habit) => number;
  onCheck: (habitId: string, date?: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onShowForm: () => void;
}

export function HabitsList({
  habits,
  celebratingHabitId,
  isChecking,
  weekDates,
  weekDays,
  isTodayChecked,
  isDateChecked,
  getWeeklyProgress,
  onCheck,
  onEdit,
  onDelete,
  onShowForm,
}: HabitsListProps) {
  if (habits.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-body-lg text-gray-500">아직 습관이 없습니다.</p>
        <button
          onClick={onShowForm}
          className="btn-cat mt-4"
        >
          + 첫 습관
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="습관 목록">
      {habits.map((habit) => (
        <div key={habit.id} role="listitem">
          <HabitCard
            habit={habit}
            isTodayChecked={isTodayChecked(habit.id)}
            isChecking={isChecking}
            isCelebrating={celebratingHabitId === habit.id}
            weeklyProgress={getWeeklyProgress(habit)}
            weekDates={weekDates}
            weekDays={weekDays}
            isDateChecked={isDateChecked}
            onCheck={onCheck}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
