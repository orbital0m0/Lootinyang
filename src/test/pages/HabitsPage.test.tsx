import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { HabitsPage } from '../../pages/HabitsPage';
import { mockUser, mockHabits } from '../mocks/supabase';

// Mock the hooks
vi.mock('../../hooks', () => ({
  useUser: () => ({
    user: mockUser,
    loading: false,
    error: null,
  }),
  useHabits: () => ({
    habits: mockHabits,
    loading: false,
    error: null,
    createHabit: vi.fn(),
    updateHabit: vi.fn(),
    deleteHabit: vi.fn(),
    isCreating: false,
  }),
  useDailyChecks: () => ({
    dailyChecks: [],
    loading: false,
    error: null,
    checkHabit: vi.fn(),
    uncheckHabit: vi.fn(),
    isTodayChecked: () => false,
    isDateChecked: () => false,
    getCheckedDatesThisWeek: () => [],
    isChecking: false,
  }),
}));

describe('HabitsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<HabitsPage />);
    expect(screen.getByText('내 습관')).toBeInTheDocument();
  });

  it('displays habit statistics', () => {
    render(<HabitsPage />);
    expect(screen.getByText(`${mockHabits.length}개`)).toBeInTheDocument();
  });

  it('displays habit list', () => {
    render(<HabitsPage />);
    mockHabits.forEach((habit) => {
      expect(screen.getByText(habit.name)).toBeInTheDocument();
    });
  });

  it('displays weekly target for each habit', () => {
    render(<HabitsPage />);
    mockHabits.forEach((habit) => {
      expect(screen.getByText(`주 ${habit.weekly_target}회 목표`)).toBeInTheDocument();
    });
  });

  it('renders floating action button when habits exist', () => {
    render(<HabitsPage />);
    const fab = screen.getByLabelText('새 습관 추가');
    expect(fab).toBeInTheDocument();
  });
});
