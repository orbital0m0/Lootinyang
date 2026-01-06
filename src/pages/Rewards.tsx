import { useState } from 'react';

export function Rewards() {
  const [selectedTab, setSelectedTab] = useState<'boxes' | 'items'>('boxes');

  return (
    <div className="p-4 space-y-4">
      {/* 페이지 헤더 */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">🎁 보상 센터</h2>
        <p className="text-sm text-gray-600">
          습관 달성으로 얻은 보상을 확인하세요!
        </p>
      </div>

      {/* 탭 */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'boxes' 
              ? 'bg-white text-primary-500 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('boxes')}
        >
          보상 상자 (3)
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'items' 
              ? 'bg-white text-primary-500 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('items')}
        >
          아이템 (8)
        </button>
      </div>

      {selectedTab === 'boxes' ? (
        /* 보상 상자 목록 */
        <div className="space-y-3">
          {/* 일일 상자 */}
          <div className="reward-box">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📦</span>
                <div>
                  <h3 className="font-semibold">일일 보상 상자</h3>
                  <p className="text-sm text-primary-600">오늘의 목표 달성 시!</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                2개 남음
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center text-2xl">
                📦
              </div>
              <div className="bg-primary-100 rounded-lg aspect-square flex items-center justify-center text-2xl animate-pulse">
                ✨
              </div>
              <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center text-2xl">
                📦
              </div>
            </div>
          </div>

          {/* 주간 상자 */}
          <div className="reward-box">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🎀</span>
                <div>
                  <h3 className="font-semibold">주간 보상 상자</h3>
                  <p className="text-sm text-cat-purple">주간 목표 100% 달성!</p>
                </div>
              </div>
              <div className="text-sm text-green-500">
                개봉 가능!
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-cat-purple to-cat-pink text-white rounded-xl font-bold animate-wiggle">
              🎁 상자 열기
            </button>
          </div>

          {/* 특별 상자 */}
          <div className="reward-box opacity-75">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <h3 className="font-semibold">특별 보상 상자</h3>
                  <p className="text-sm text-amber-600">3주 연속 성공 시!</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                2주차
              </div>
            </div>
            <div className="w-full py-3 bg-gray-200 rounded-xl text-gray-500 text-center">
              🔒 1주 후 개봉 가능
            </div>
          </div>
        </div>
      ) : (
        /* 아이템 목록 */
        <div className="space-y-3">
          {/* 보유 아이템 */}
          <div>
            <h3 className="font-semibold mb-3">보유 아이템</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: '🧸', name: '고양이 장난감', count: 3 },
                { icon: '🐟', name: '고양이 간식', count: 5 },
                { icon: '🛋️', name: '고양이 쿠션', count: 1 },
                { icon: '🛡️', name: '하루 보호막', count: 2 },
                { icon: '🐱', name: '행운의 고양이', count: 1 },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xs font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">x{item.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 아이템 사용 */}
          <div>
            <h3 className="font-semibold mb-3">아이템 사용</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🛡️</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">하루 보호막 사용</p>
                    <p className="text-xs text-gray-500">오늘 체크를 잊어도 괜찮아요</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">2개</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🐱</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">행운의 고양이 사용</p>
                    <p className="text-xs text-gray-500">다음 상자 레어도 UP!</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">1개</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 빠른 액션 */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button className="btn-secondary">
          📊 획득 기록
        </button>
        <button className="btn-secondary">
          🎯 목표 확인
        </button>
      </div>
    </div>
  );
}