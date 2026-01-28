import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: 'home', iconFilled: 'home', label: '홈' },
    { path: '/habits', icon: 'bar_chart', iconFilled: 'bar_chart', label: '통계' },
    { path: '/cat-room', icon: 'pets', iconFilled: 'pets', label: '고양이 방' },
  ];

  return (
    <nav className="bottom-nav" aria-label="메인 네비게이션">
      <div className="flex items-center justify-around" role="list">
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
              <motion.span
                className={`material-symbols-outlined text-[28px] ${isActive ? 'filled' : ''}`}
                animate={{
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {item.icon}
              </motion.span>
              <span className="text-[11px] font-bold">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
