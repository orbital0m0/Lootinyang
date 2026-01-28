import { useLocation, Outlet, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../hooks';
import { ErrorBoundary } from './ErrorBoundary';

export function Layout() {
  const location = useLocation();
  const { user } = useUser();

  useEffect(() => {
    if (!sessionStorage.getItem('v3-loaded')) {
      sessionStorage.setItem('v3-loaded', 'true');
      window.location.reload();
    }
  }, []);

  const navItems = [
    { path: '/', icon: 'home', label: '홈' },
    { path: '/habits', icon: 'bar_chart', label: '통계' },
    { path: '/cat-room', icon: 'pets', label: '고양이 방' },
  ];

  const hideHeaderPaths = ['/auth', '/habits', '/cat-room'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="mini-app-container safe-area bg-background-light">
      {/* Header - iOS Style (only on home) */}
      {showHeader && (
        <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  🐱
                </motion.span>
                <h1 className="font-bold text-xl text-[#1A1C1E]">Habit Cat</h1>
              </Link>
              <div className="flex items-center gap-3">
                {user && (
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 ios-shadow">
                    <span className="material-symbols-outlined text-primary text-sm">stars</span>
                    <span className="text-sm font-bold text-[#1A1C1E]">Lv.{user.level || 1}</span>
                  </div>
                )}
                <button className="btn-icon">
                  <span className="material-symbols-outlined text-xl text-[#1A1C1E]">
                    notifications
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="pb-24 min-h-screen">
        <ErrorBoundary type="page">
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Bottom Navigation - iOS Style */}
      <nav className="bottom-nav" aria-label="메인 네비게이션">
        <div className="flex items-center justify-around" role="list">
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
                  className={`material-symbols-outlined text-[28px] ${isActive ? 'filled' : ''}`}
                  animate={isActive ? { y: -2 } : { y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {item.icon}
                </motion.span>
                <span className="text-[11px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
