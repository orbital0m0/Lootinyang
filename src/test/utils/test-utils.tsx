/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from 'react';
import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// Create a new QueryClient for each test
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface WrapperProps {
  children: ReactNode;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

// All providers wrapper
function AllProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

// Memory Router wrapper for testing specific routes
function createMemoryRouterWrapper(initialEntries: string[] = ['/']) {
  return function MemoryRouterWrapper({ children }: WrapperProps) {
    const queryClient = createTestQueryClient();

    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

// Custom render function
export function render(
  ui: ReactElement,
  { initialEntries, ...options }: CustomRenderOptions = {}
) {
  const Wrapper = initialEntries
    ? createMemoryRouterWrapper(initialEntries)
    : AllProviders;

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Render with QueryClient only (no router)
export function renderWithQueryClient(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const queryClient = createTestQueryClient();

  function QueryWrapper({ children }: WrapperProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return {
    ...rtlRender(ui, { wrapper: QueryWrapper, ...options }),
    queryClient,
  };
}

// Re-export specific items from testing-library (not using export *)
export {
  screen,
  fireEvent,
  waitFor,
  within,
  cleanup,
} from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
