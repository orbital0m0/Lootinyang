import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: '🏠', label: '홈' },
    { path: '/habits', icon: '📊', label: '트래커' },
    { path: '/cat-room', icon: '🐱', label: '고양이 방' },
    { path: '/profile', icon: '👤', label: '프로필' },
  ];

  return (
    <nav className="bottom-nav" aria-label="메인 네비게이션">
      <div className="flex justify-around" role="list">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${item.label} ${isActive ? '(현재 페이지)' : ''}`}
              role="listitem"
            >
              <motion.div
                animate={{
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <span className="text-2xl mb-1" aria-hidden="true">{item.icon}</span>
              </motion.div>
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
