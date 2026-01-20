import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ErrorFallback } from '../../components/ErrorFallback';

// Component that throws an error
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error fallback when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('이런! 문제가 발생했어요')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('renders retry button in fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /다시 시도/i })).toBeInTheDocument();
  });

  it('has accessible error alert role', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('ErrorFallback', () => {
  it('renders error message', () => {
    const error = new Error('Test error message');
    const resetError = vi.fn();

    render(<ErrorFallback error={error} resetError={resetError} />);
    expect(screen.getByText('이런! 문제가 발생했어요')).toBeInTheDocument();
  });

  it('calls resetError when retry button is clicked', () => {
    const error = new Error('Test error');
    const resetError = vi.fn();

    render(<ErrorFallback error={error} resetError={resetError} />);
    fireEvent.click(screen.getByRole('button', { name: /다시 시도/i }));
    expect(resetError).toHaveBeenCalledTimes(1);
  });

  it('renders home button for page type errors', () => {
    const error = new Error('Test error');
    const resetError = vi.fn();

    render(<ErrorFallback error={error} resetError={resetError} type="page" />);
    expect(screen.getByRole('button', { name: /홈으로/i })).toBeInTheDocument();
  });

  it('does not render home button for app type errors', () => {
    const error = new Error('Test error');
    const resetError = vi.fn();

    render(<ErrorFallback error={error} resetError={resetError} type="app" />);
    expect(screen.queryByRole('button', { name: /홈으로/i })).not.toBeInTheDocument();
  });

  it('has aria-live for screen readers', () => {
    const error = new Error('Test error');
    const resetError = vi.fn();

    render(<ErrorFallback error={error} resetError={resetError} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});
