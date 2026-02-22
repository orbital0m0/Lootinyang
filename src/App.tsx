import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { HabitsPage } from './pages/HabitsPage';
import { Rewards } from './pages/Rewards';
import { Profile } from './pages/Profile';
import { Achievements } from './pages/Achievements';
import { CatRoom } from './pages/CatRoom';
import { Onboarding } from './pages/Onboarding';
import { DataWarningBanner } from './components/DataWarningBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorFallback } from './components/ErrorFallback';
import { ToastProvider } from './components/Toast';

// 페이지 전환 애니메이션 래퍼 컴포넌트
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// React Query 클라이언트 생성 (localStorage 기반이므로 staleTime: Infinity, retry: 0)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// 라우터 에러 폴백 컴포넌트
function RouterErrorFallback() {
  return (
    <ErrorFallback
      error={new Error('페이지를 찾을 수 없습니다.')}
      resetError={() => { window.location.href = '/'; }}
      type="page"
    />
  );
}

// 라우터 설정
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouterErrorFallback />,
    children: [
      {
        index: true,
        element: <PageTransition><Home /></PageTransition>,
      },
      {
        path: 'habits',
        element: <PageTransition><HabitsPage /></PageTransition>,
      },
      {
        path: 'rewards',
        element: <PageTransition><Rewards /></PageTransition>,
      },
      {
        path: 'profile',
        element: <PageTransition><Profile /></PageTransition>,
      },
      {
        path: 'achievements',
        element: <PageTransition><Achievements /></PageTransition>,
      },
      {
        path: 'cat-room',
        element: <PageTransition><CatRoom /></PageTransition>,
      },
    ],
  },
  {
    path: '/onboarding',
    element: <PageTransition><Onboarding /></PageTransition>,
    errorElement: <RouterErrorFallback />,
  },
]);

// 앱 루트 컴포넌트
function App() {
  return (
    <ErrorBoundary type="app">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <DataWarningBanner />
            <RouterProvider router={router} />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
