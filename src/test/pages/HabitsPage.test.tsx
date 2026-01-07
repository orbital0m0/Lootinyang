import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HabitsPage } from '../../pages/HabitsPage';

describe('HabitsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<HabitsPage />);
    expect(container.firstChild).not.toBeNull();
  });
});
