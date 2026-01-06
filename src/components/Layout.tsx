// 레이아웃 컴포넌트 props 타입
export interface LayoutProps {
  children?: React.ReactNode;
}

// 메인 레이아웃 컴포넌트
export function Layout({ children }: LayoutProps) {
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
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white text-sm">🐱</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pb-16">
        {children}
      </main>

      {/* 하단 네비게이션 */}
      <nav className="bottom-nav">
        <div className="flex justify-around py-2">
          <a 
            href="/" 
            className="nav-item active"
          >
            <span className="text-xl mb-1">🏠</span>
            <span className="text-xs">홈</span>
          </a>
          <a 
            href="/habits" 
            className="nav-item"
          >
            <span className="text-xl mb-1">✅</span>
            <span className="text-xs">습관</span>
          </a>
          <a 
            href="/rewards" 
            className="nav-item"
          >
            <span className="text-xl mb-1">🎁</span>
            <span className="text-xs">보상</span>
          </a>
          <a 
            href="/profile" 
            className="nav-item"
          >
            <span className="text-xl mb-1">👤</span>
            <span className="text-xs">프로필</span>
          </a>
        </div>
      </nav>
    </div>
  );
}