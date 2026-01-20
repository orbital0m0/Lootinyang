import { vi } from 'vitest';

// Mock Supabase user
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  username: '테스트유저',
  level: 5,
  exp: 350,
  streak: 7,
  created_at: '2024-01-01T00:00:00Z',
};

// Mock habits
export const mockHabits = [
  {
    id: 'habit-1',
    user_id: 'test-user-id',
    name: '운동하기',
    weekly_target: 3,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'habit-2',
    user_id: 'test-user-id',
    name: '독서하기',
    weekly_target: 5,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock daily checks
export const mockDailyChecks = [
  {
    id: 'check-1',
    habit_id: 'habit-1',
    user_id: 'test-user-id',
    checked_date: new Date().toISOString().split('T')[0],
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Mock auth session
export const mockSession = {
  access_token: 'mock-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh-token',
  user: {
    id: mockUser.id,
    email: mockUser.email,
    user_metadata: {
      username: mockUser.username,
    },
  },
};

// Create chainable mock for Supabase queries
const createQueryBuilder = (data: unknown = null, error: unknown = null) => {
  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    then: vi.fn((resolve) => resolve({ data, error })),
  };
  return builder;
};

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: mockSession },
      error: null,
    }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: mockSession.user },
      error: null,
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: mockSession.user, session: mockSession },
      error: null,
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: mockSession.user, session: mockSession },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  },
  from: vi.fn((table: string) => {
    switch (table) {
      case 'users':
        return createQueryBuilder(mockUser);
      case 'habits':
        return createQueryBuilder(mockHabits);
      case 'daily_checks':
        return createQueryBuilder(mockDailyChecks);
      default:
        return createQueryBuilder();
    }
  }),
};

// Mock the supabase module
vi.mock('../../services/supabase', () => ({
  supabase: mockSupabaseClient,
}));

// Helper function to reset all mocks
export const resetSupabaseMocks = () => {
  vi.clearAllMocks();
};

// Helper function to set custom mock responses
export const setMockResponse = (table: string, data: unknown, error: unknown = null) => {
  mockSupabaseClient.from.mockImplementation((t: string) => {
    if (t === table) {
      return createQueryBuilder(data, error);
    }
    return createQueryBuilder();
  });
};
