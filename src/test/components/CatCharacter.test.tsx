import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '../utils/test-utils';
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

  it('renders with default mood', () => {
    render(<CatCharacter />);
    // The cat should render with some visual representation
    const container = document.querySelector('[class*="cat"]') || document.querySelector('button');
    expect(container).toBeInTheDocument();
  });

  it('renders with custom mood', () => {
    render(<CatCharacter mood="happy" />);
    const container = document.querySelector('[class*="cat"]') || document.querySelector('button');
    expect(container).toBeInTheDocument();
  });

  it('triggers onMoodChange callback when button is clicked', () => {
    const handleMoodChange = vi.fn();
    render(<CatCharacter onMoodChange={handleMoodChange} />);

    const button = document.querySelector('button');
    if (button) {
      fireEvent.click(button);
      expect(handleMoodChange).toHaveBeenCalledTimes(1);
      expect(handleMoodChange).toHaveBeenCalledWith('happy');
    }
  });

  it('has accessible button with aria-label', () => {
    render(<CatCharacter />);
    const button = document.querySelector('button');
    expect(button).toBeInTheDocument();
    // The button should have some accessible attributes
    expect(button).toHaveAttribute('aria-label');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<CatCharacter size="sm" />);
    expect(document.querySelector('button')).toBeInTheDocument();

    rerender(<CatCharacter size="md" />);
    expect(document.querySelector('button')).toBeInTheDocument();

    rerender(<CatCharacter size="lg" />);
    expect(document.querySelector('button')).toBeInTheDocument();
  });
});
