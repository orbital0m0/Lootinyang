import { useLocation } from 'react-router-dom';

export function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: '홈' },
    { path: '/habits', icon: '🐱', label: '습관' },
    { path: '/achievements', icon: '🏆', label: '업적' },
    { path: '/profile', icon: '👤', label: '프로필' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              // 네비게이션 로직은 나중에 구현
              console.log('Navigate to:', item.path);
            }}
            className={`nav-item ${
              location.pathname === item.path ? 'active' : ''
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}