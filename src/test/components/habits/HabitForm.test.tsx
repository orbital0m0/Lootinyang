import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { HabitForm } from '../../../components/habits/HabitForm';

describe('HabitForm', () => {
  const defaultProps = {
    isOpen: true,
    editingHabit: null,
    isCreating: false,
    userId: 'test-user-id',
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    onUpdate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    render(<HabitForm {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open', () => {
    render(<HabitForm {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders form title for new habit', () => {
    render(<HabitForm {...defaultProps} />);
    expect(screen.getByText('새 습관')).toBeInTheDocument();
  });

  it('renders form title for editing habit', () => {
    const editingHabit = {
      id: 'habit-1',
      user_id: 'test-user-id',
      name: 'Test Habit',
      weekly_target: 3,
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };
    render(<HabitForm {...defaultProps} editingHabit={editingHabit} />);
    expect(screen.getByText('습관 수정')).toBeInTheDocument();
  });

  it('pre-fills form when editing', () => {
    const editingHabit = {
      id: 'habit-1',
      user_id: 'test-user-id',
      name: 'Test Habit',
      weekly_target: 5,
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };
    render(<HabitForm {...defaultProps} editingHabit={editingHabit} />);

    expect(screen.getByLabelText(/습관 이름/i)).toHaveValue('Test Habit');
    expect(screen.getByLabelText(/주 목표/i)).toHaveValue('5');
  });

  it('calls onClose when close button clicked', async () => {
    render(<HabitForm {...defaultProps} />);

    const closeButton = screen.getByLabelText('닫기');
    await userEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key pressed', async () => {
    render(<HabitForm {...defaultProps} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onSubmit with form data when creating', async () => {
    render(<HabitForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/습관 이름/i);
    const targetSelect = screen.getByLabelText(/주 목표/i);

    await userEvent.type(nameInput, '새 습관');
    await userEvent.selectOptions(targetSelect, '5');

    const submitButton = screen.getByRole('button', { name: '생성' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        name: '새 습관',
        weekly_target: 5,
        user_id: 'test-user-id',
        is_active: true,
      });
    });
  });

  it('calls onUpdate when editing', async () => {
    const editingHabit = {
      id: 'habit-1',
      user_id: 'test-user-id',
      name: 'Old Name',
      weekly_target: 3,
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };
    render(<HabitForm {...defaultProps} editingHabit={editingHabit} />);

    const nameInput = screen.getByLabelText(/습관 이름/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Name');

    const submitButton = screen.getByRole('button', { name: '수정' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'habit-1',
          name: 'New Name',
        })
      );
    });
  });

  it('disables submit button when creating', () => {
    render(<HabitForm {...defaultProps} isCreating={true} />);

    expect(screen.getByRole('button', { name: '생성 중...' })).toBeDisabled();
  });

  it('has accessible form labels', () => {
    render(<HabitForm {...defaultProps} />);

    expect(screen.getByLabelText(/습관 이름/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/주 목표/i)).toBeInTheDocument();
  });

  it('has aria-modal attribute', () => {
    render(<HabitForm {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby pointing to title', () => {
    render(<HabitForm {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'habit-form-title');
    expect(screen.getByText('새 습관')).toHaveAttribute('id', 'habit-form-title');
  });

  it('requires habit name input', () => {
    render(<HabitForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/습관 이름/i);
    expect(nameInput).toHaveAttribute('aria-required', 'true');
    expect(nameInput).toBeRequired();
  });
});
