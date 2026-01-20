import { motion, AnimatePresence } from 'framer-motion';
import type { Habit } from '../../types';
import { WeeklyProgress } from './WeeklyProgress';

interface HabitCardProps {
  habit: Habit;
  isTodayChecked: boolean;
  isChecking: boolean;
  isCelebrating: boolean;
  weeklyProgress: number;
  weekDates: string[];
  weekDays: string[];
  isDateChecked: (habitId: string, date: string) => boolean;
  onCheck: (habitId: string, date?: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

function getHabitIcon(name: string): string {
  if (name === '운동하기') return '🏃';
  if (name === '독서하기') return '📚';
  if (name === '명상') return '🧘';
  if (name === '운동') return '💪';
  return '🐱';
}

export function HabitCard({
  habit,
  isTodayChecked,
  isChecking,
  isCelebrating,
  weeklyProgress,
  weekDates,
  weekDays,
  isDateChecked,
  onCheck,
  onEdit,
  onDelete,
}: HabitCardProps) {
  return (
    <div className="card-habit">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="text-2xl mb-1" aria-hidden="true">
              {getHabitIcon(habit.name)}
            </div>
            <div className="ml-2">
              <h3 className="font-heading">{habit.name}</h3>
              <p className="text-body-sm text-gray-500">주 {habit.weekly_target}회 목표</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <AnimatePresence>
            {isCelebrating && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                transition={{ duration: 0.5 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-2xl"
                    initial={{ opacity: 1, scale: 1, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1.5,
                      y: -50 - i * 10,
                      x: (i - 2) * 20,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                    }}
                    aria-hidden="true"
                  >
                    {'✨🎉🎊'[i % 3]}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => onCheck(habit.id)}
            disabled={isChecking}
            className={`btn-icon text-lg relative ${
              isTodayChecked
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-primary-100'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label={isTodayChecked ? `${habit.name} 완료됨` : `${habit.name} 체크하기`}
            aria-pressed={isTodayChecked}
          >
            <motion.span
              animate={isTodayChecked ? {
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{
                duration: 0.5,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            >
              {isTodayChecked ? '✅' : '⭕'}
            </motion.span>
          </motion.button>
          <motion.button
            onClick={() => onEdit(habit)}
            className="btn-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label={`${habit.name} 수정하기`}
          >
            <span aria-hidden="true">✏️</span>
          </motion.button>
          <motion.button
            onClick={() => onDelete(habit.id)}
            className="btn-icon text-error-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label={`${habit.name} 삭제하기`}
          >
            <span aria-hidden="true">🗑️</span>
          </motion.button>
        </div>
      </div>

      <WeeklyProgress
        habitId={habit.id}
        habitName={habit.name}
        progress={weeklyProgress}
        weekDates={weekDates}
        weekDays={weekDays}
        isDateChecked={isDateChecked}
        onToggleCheck={onCheck}
      />
    </div>
  );
}
