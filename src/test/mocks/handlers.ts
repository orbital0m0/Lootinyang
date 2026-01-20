// API response handlers for tests
// Can be used with MSW (Mock Service Worker) if needed in the future

import { mockUser, mockHabits, mockDailyChecks } from './supabase';

// Response helpers
export const successResponse = <T>(data: T) => ({
  data,
  error: null,
});

export const errorResponse = (message: string, code?: string) => ({
  data: null,
  error: { message, code },
});

// Mock API responses
export const mockResponses = {
  user: {
    success: successResponse(mockUser),
    notFound: errorResponse('User not found', 'PGRST116'),
    unauthorized: errorResponse('Invalid credentials', 'AUTH_INVALID'),
  },
  habits: {
    success: successResponse(mockHabits),
    empty: successResponse([]),
    createSuccess: (habit: typeof mockHabits[0]) => successResponse(habit),
    updateSuccess: (habit: typeof mockHabits[0]) => successResponse(habit),
    deleteSuccess: successResponse(null),
  },
  dailyChecks: {
    success: successResponse(mockDailyChecks),
    empty: successResponse([]),
    checkSuccess: (check: typeof mockDailyChecks[0]) => successResponse(check),
    uncheckSuccess: successResponse(null),
  },
  auth: {
    loginSuccess: successResponse({
      user: { id: mockUser.id, email: mockUser.email },
      session: { access_token: 'mock-token' },
    }),
    loginFailure: errorResponse('Invalid login credentials', 'AUTH_INVALID'),
    signupSuccess: successResponse({
      user: { id: mockUser.id, email: mockUser.email },
      session: null,
    }),
    signupFailure: errorResponse('User already registered', 'AUTH_ALREADY_REGISTERED'),
    logoutSuccess: successResponse(null),
  },
};

// Factory functions for creating test data
export const createMockHabit = (overrides: Partial<typeof mockHabits[0]> = {}) => ({
  id: `habit-${Date.now()}`,
  user_id: 'test-user-id',
  name: 'Test Habit',
  weekly_target: 3,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockDailyCheck = (overrides: Partial<typeof mockDailyChecks[0]> = {}) => ({
  id: `check-${Date.now()}`,
  habit_id: 'habit-1',
  user_id: 'test-user-id',
  checked_date: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockUser = (overrides: Partial<typeof mockUser> = {}) => ({
  ...mockUser,
  ...overrides,
});
