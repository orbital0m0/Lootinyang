import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CatCharacter } from '../../components/CatCharacter';

describe('CatCharacter', () => {
  it('renders without crashing', () => {
    const { container } = render(<CatCharacter />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders button element', () => {
    const { container } = render(<CatCharacter />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
