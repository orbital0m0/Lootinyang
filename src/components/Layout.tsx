import { useLocation, Outlet, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../hooks';
import { ErrorBoundary } from './ErrorBoundary';

// 메인 레이아웃 컴포넌트 - Cozy Game Style
export function Layout() {
  const location = useLocation();
  const { user } = useUser();

  // 페이지 접속 시 한번만 강제 새로고침
  useEffect(() => {
    if (!sessionStorage.getItem('v2-loaded')) {
      sessionStorage.setItem('v2-loaded', 'true');
      window.location.reload();
    }
  }, []);

  const navItems = [
    { path: '/', icon: '🏠', label: '홈' },
    { path: '/habits', icon: '✅', label: '습관' },
    { path: '/cat-room', icon: '🐱', label: '고양이방' },
    { path: '/profile', icon: '👤', label: '프로필' },
  ];

  return (
    <div className="mini-app-container safe-area">
      {/* 헤더 - Cozy Game Style */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'var(--cozy-warm-white)',
          borderBottom: '4px solid var(--cozy-brown-light)',
          boxShadow: '0 4px 12px rgba(139, 115, 85, 0.1)',
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                🐱
              </motion.span>
              <h1 className="font-display text-xl text-cozy-brown-dark">Lootinyang</h1>
            </Link>
            <div className="flex items-center gap-3">
              <div className="level-badge text-sm">
                {user?.level || 1}
              </div>
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl border-3 border-cozy-brown"
                style={{
                  background: 'linear-gradient(135deg, var(--cozy-orange-light) 0%, var(--cozy-orange) 100%)',
                  borderWidth: '3px',
                  boxShadow: '0 3px 0 var(--cozy-brown-dark)',
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                🐱
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="pb-24 min-h-screen">
        <ErrorBoundary type="page">
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* 하단 네비게이션 - Cozy Game Style */}
      <nav className="bottom-nav" aria-label="메인 네비게이션">
        <div className="flex justify-around" role="list">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${item.label} ${isActive ? '(현재 페이지)' : ''}`}
                role="listitem"
              >
                <motion.span
                  className="text-2xl mb-0.5"
                  animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  aria-hidden="true"
                >
                  {item.icon}
                </motion.span>
                <span className="text-xs font-heading font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}