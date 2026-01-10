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
import { DatabaseTest } from './pages/DatabaseTest';
import { AuthPage } from './pages/Auth';

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

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// 라우터 설정
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <div className="text-center p-8">페이지를 찾을 수 없습니다.</div>,
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
      {
        path: 'test',
        element: <PageTransition><DatabaseTest /></PageTransition>,
      },
    ],
  },
  {
    path: '/auth',
    element: <PageTransition><AuthPage /></PageTransition>,
    errorElement: <div className="text-center p-8">인증 오류가 발생했습니다.</div>,
  },
]);

// 앱 루트 컴포넌트
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  );
}

export default App;