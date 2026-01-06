import { useState } from 'react';

export function Profile() {
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats');

  return (
    <div className="p-4 space-y-4">
      {/* 페이지 헤더 */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-3 bg-cat-orange rounded-full flex items-center justify-center text-4xl">
          🐱
        </div>
        <h2 className="text-xl font-bold">냥냥이</h2>
        <p className="text-sm text-gray-600">Level 5 경험치 치사각</p>
      </div>

      {/* 레벨 정보 */}
      <div className="card">
        <h3 className="font-semibold mb-3">📊 레벨 정보</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Level 5</span>
              <span className="text-gray-500">350/500 EXP</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: '70%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'stats' 
              ? 'bg-white text-primary-500 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          통계
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings' 
              ? 'bg-white text-primary-500 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          설정
        </button>
      </div>

      {activeTab === 'stats' ? (
        /* 통계 탭 */
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="card-achievement">
              <div className="text-center">
                <div className="text-2xl mb-1">🔥</div>
                <p className="text-2xl font-bold text-orange-500">7</p>
                <p className="text-xs text-gray-600">연속 일수</p>
              </div>
            </div>
            <div className="card-achievement">
              <div className="text-center">
                <div className="text-2xl mb-1">✅</div>
                <p className="text-2xl font-bold text-green-500">42</p>
                <p className="text-xs text-gray-600">전체 체크</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="card-achievement">
              <div className="text-center">
                <div className="text-2xl mb-1">📅</div>
                <p className="text-2xl font-bold text-blue-500">85%</p>
                <p className="text-xs text-gray-600">달성률</p>
              </div>
            </div>
            <div className="card-achievement">
              <div className="text-center">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-2xl font-bold text-purple-500">12</p>
                <p className="text-xs text-gray-600">업적</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">📈 주간 통계</h3>
            <div className="space-y-2">
              {['운동하기', '독서하기', '명상하기'].map((habit, index) => (
                <div key={habit} className="flex justify-between items-center">
                  <span className="text-sm">{habit}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: [66, 80, 40][index] + '%' }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {[2, 4, 2][index]}/3
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 설정 탭 */
        <div className="space-y-3">
          <div className="card">
            <h3 className="font-semibold mb-3">⚙️ 알림 설정</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">습관 리마인더</p>
                  <p className="text-xs text-gray-500">매일 9시 알림</p>
                </div>
                <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">보상 알림</p>
                  <p className="text-xs text-gray-500">상자 획득 시 알림</p>
                </div>
                <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">🎨 테마 설정</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: '기본', color: 'bg-primary-500' },
                { name: '오렌지', color: 'bg-cat-orange' },
                { name: '보라', color: 'bg-cat-purple' },
                { name: '핑크', color: 'bg-cat-pink' },
              ].map((theme, index) => (
                <button
                  key={theme.name}
                  className={`p-3 rounded-lg border-2 ${
                    index === 0 ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${theme.color} mx-auto mb-1`}></div>
                  <p className="text-xs">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">🔐 계정</h3>
            <div className="space-y-2">
              <button className="w-full btn-secondary text-left">
                <span>📧 이메일 변경</span>
              </button>
              <button className="w-full btn-secondary text-left">
                <span>🔒 비밀번호 변경</span>
              </button>
              <button className="w-full btn-secondary text-left text-red-500">
                <span>🚪 로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 링크 */}
      <div className="text-center space-y-2 mt-6">
        <button className="text-sm text-gray-500">개인정보처리방침</button>
        <span className="text-gray-300">•</span>
        <button className="text-sm text-gray-500">이용약관</button>
      </div>
    </div>
  );
}