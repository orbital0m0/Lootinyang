import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

// 레이아웃 컴포넌트 props 타입
export interface LayoutProps {
  children?: React.ReactNode;
}

// 메인 레이아웃 컴포넌트
export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: '홈' },
    { path: '/habits', icon: '📊', label: '트래커' },
    { path: '/cat-room', icon: '🐱', label: '고양이 방' },
    { path: '/profile', icon: '👤', label: '프로필' },
  ];

  return (
    <div className="mini-app-container">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐱</span>
              <h1 className="text-lg font-bold text-gray-800">Lootinyang</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                Lv.1
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cat-orange to-cat-pink flex items-center justify-center shadow-md">
                <span className="text-white text-sm">🐱</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="pb-16">
        {children}
      </main>

      {/* 하단 네비게이션 */}
      <nav className="bottom-nav">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}