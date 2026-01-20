import { useState, useEffect, useRef, useCallback } from 'react';
import type { Habit } from '../../types';

interface HabitFormProps {
  isOpen: boolean;
  editingHabit: Habit | null;
  isCreating: boolean;
  userId: string;
  onClose: () => void;
  onSubmit: (habitData: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (habit: Habit) => Promise<void>;
}

export function HabitForm({
  isOpen,
  editingHabit,
  isCreating,
  userId,
  onClose,
  onSubmit,
  onUpdate,
}: HabitFormProps) {
  const [name, setName] = useState('');
  const [weeklyTarget, setWeeklyTarget] = useState(3);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Sync form state when editing habit changes
  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setWeeklyTarget(editingHabit.weekly_target);
    } else {
      setName('');
      setWeeklyTarget(3);
    }
  }, [editingHabit]);

  // Focus management and trap
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Delay focus to allow animation to complete
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHabit) {
      await onUpdate({ ...editingHabit, name, weekly_target: weeklyTarget });
    } else {
      await onSubmit({
        name,
        weekly_target: weeklyTarget,
        user_id: userId,
        is_active: true,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="card max-w-md w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-form-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="habit-form-title" className="font-heading text-gray-800">
            {editingHabit ? '습관 수정' : '새 습관'}
          </h3>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="닫기"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="habit-name" className="block text-body font-medium text-gray-700 mb-2">
                습관 이름
              </label>
              <input
                ref={firstInputRef}
                id="habit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="예: 운동하기"
                required
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="habit-target" className="block text-body font-medium text-gray-700 mb-2">
                주 목표
              </label>
              <select
                id="habit-target"
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                required
                aria-required="true"
              >
                <option value="1">주 1회</option>
                <option value="2">주 2회</option>
                <option value="3">주 3회</option>
                <option value="4">주 4회</option>
                <option value="5">주 5회</option>
                <option value="6">주 6회</option>
                <option value="7">주 7회</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full btn-primary mt-4"
          >
            {isCreating ? '생성 중...' : (editingHabit ? '수정' : '생성')}
          </button>
        </form>
      </div>
    </div>
  );
}
