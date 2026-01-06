import { useState } from 'react';

export function Habits() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  return (
    <div className="p-4 space-y-4">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">✅ 내 습관</h2>
        <button className="btn-primary text-sm">
          + 추가
        </button>
      </div>

      {/* 탭 */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'active' 
              ? 'bg-white text-primary-500 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('active')}
        >
          진행 중 (2)
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'completed' 
              ? 'bg-white text-primary-500 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          완료됨 (0)
        </button>
      </div>

      {/* 습관 목록 */}
      <div className="space-y-3">
        {activeTab === 'active' ? (
          <>
            <div className="card-habit">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏃</span>
                  <div>
                    <h3 className="font-semibold">운동하기</h3>
                    <p className="text-sm text-gray-500">주 3회 목표</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-secondary text-xs">
                    수정
                  </button>
                  <button className="btn-secondary text-xs text-red-500">
                    삭제
                  </button>
                </div>
              </div>
              
              {/* 주간 진행률 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>이번 주 진행률</span>
                  <span className="font-medium">2/3</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '66%' }}
                  />
                </div>
                
                {/* 체크박스 */}
                <div className="grid grid-cols-7 gap-1 mt-3">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                    <div 
                      key={day} 
                      className="aspect-square flex items-center justify-center text-xs rounded border"
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        defaultChecked={index < 2}
                        id={`exercise-${day}`}
                      />
                      <label 
                        htmlFor={`exercise-${day}`}
                        className={`w-full h-full flex items-center justify-center rounded cursor-pointer ${
                          index < 2 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-gray-100'
                        }`}
                      >
                        {day[0]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card-habit">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h3 className="font-semibold">독서하기</h3>
                    <p className="text-sm text-gray-500">주 5회 목표</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-secondary text-xs">
                    수정
                  </button>
                  <button className="btn-secondary text-xs text-red-500">
                    삭제
                  </button>
                </div>
              </div>
              
              {/* 주간 진행률 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>이번 주 진행률</span>
                  <span className="font-medium">4/5</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '80%' }}
                  />
                </div>
                
                {/* 체크박스 */}
                <div className="grid grid-cols-7 gap-1 mt-3">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                    <div 
                      key={day} 
                      className="aspect-square flex items-center justify-center text-xs rounded border"
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        defaultChecked={index < 4}
                        id={`reading-${day}`}
                      />
                      <label 
                        htmlFor={`reading-${day}`}
                        className={`w-full h-full flex items-center justify-center rounded cursor-pointer ${
                          index < 4 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-gray-100'
                        }`}
                      >
                        {day[0]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            완료된 습관이 없습니다.
          </div>
        )}
      </div>

      {/* 습관 추가 버튼 */}
      <button className="w-full btn-cat">
        + 새 습관 만들기
      </button>
    </div>
  );
}