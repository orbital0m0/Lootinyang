import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import { HabitStatistics } from '../../../components/habits/HabitStatistics';

describe('HabitStatistics', () => {
  it('renders habit count', () => {
    render(<HabitStatistics habitCount={5} completionRate={80} streak={7} />);
    expect(screen.getByText('5개')).toBeInTheDocument();
  });

  it('renders completion rate', () => {
    render(<HabitStatistics habitCount={5} completionRate={80} streak={7} />);
    expect(screen.getByText('완료율 80%')).toBeInTheDocument();
  });

  it('renders streak', () => {
    render(<HabitStatistics habitCount={5} completionRate={80} streak={7} />);
    expect(screen.getByText('스트릭 7일')).toBeInTheDocument();
  });

  it('handles zero values', () => {
    render(<HabitStatistics habitCount={0} completionRate={0} streak={0} />);
    expect(screen.getByText('0개')).toBeInTheDocument();
    expect(screen.getByText('완료율 0%')).toBeInTheDocument();
    expect(screen.getByText('스트릭 0일')).toBeInTheDocument();
  });

  it('has accessible screen reader text', () => {
    render(<HabitStatistics habitCount={5} completionRate={80} streak={7} />);
    expect(screen.getByText('총 습관 수: 5개')).toBeInTheDocument();
    expect(screen.getByText('주간 완료율: 80퍼센트')).toBeInTheDocument();
    expect(screen.getByText('연속 달성: 7일')).toBeInTheDocument();
  });

  it('renders with decorative icons', () => {
    const { container } = render(
      <HabitStatistics habitCount={5} completionRate={80} streak={7} />
    );
    // Decorative icons should have aria-hidden
    const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenElements.length).toBeGreaterThan(0);
  });
});
