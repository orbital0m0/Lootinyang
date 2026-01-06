import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Habits } from './pages/Habits';
import { Rewards } from './pages/Rewards';
import { Profile } from './pages/Profile';
import { Achievements } from './pages/Achievements';
import { DatabaseTest } from './pages/DatabaseTest';
import { AuthPage } from './pages/Auth';

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
        element: <Home />,
      },
      {
        path: 'habits',
        element: <Habits />,
      },
      {
        path: 'rewards',
        element: <Rewards />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'achievements',
        element: <Achievements />,
      },
      {
        path: 'test',
        element: <DatabaseTest />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
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