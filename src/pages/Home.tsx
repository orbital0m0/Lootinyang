import { useState, useEffect } from 'react';
import { useUser } from '../hooks';

export function Home() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // 인증되지 않은 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!user) {
      window.location.href = '/auth';
    }
  }, [user]);

  return (
    <div className="p-4 space-y-6">
      {/* 환영 메시지 */}
      <section className="bg-gradient-to-r from-primary-400 to-primary-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🐱 안녕하세요!</h2>
        <p className="text-primary-100">
          오늘도 습관 형성을 시작해볼까요?
        </p>
      </section>

      {/* 오늘의 목표 */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4">📅 오늘의 목표</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🏃</span>
              <div>
                <p className="font-medium">운동하기</p>
                <p className="text-sm text-gray-500">주 3회 목표</p>
              </div>
            </div>
            <button className="btn-secondary text-sm">
              체크
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-xl">📚</span>
              <div>
                <p className="font-medium">독서하기</p>
                <p className="text-sm text-gray-500">주 5회 목표</p>
              </div>
            </div>
            <button className="btn-primary text-sm">
              체크
            </button>
          </div>
        </div>
      </section>

      {/* 진행 상황 */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4">📊 이번 주 진행상황</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">운동하기</span>
              <span className="text-sm text-gray-500">2/3</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: '66%' }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">독서하기</span>
              <span className="text-sm text-gray-500">4/5</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: '80%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 고양이 캐릭터 */}
      <section className="card text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-cat-orange rounded-full flex items-center justify-center text-4xl animate-bounce-slow">
          🐱
        </div>
        <p className="text-sm text-gray-600">고양이가 응원하고 있어요!</p>
      </section>

      {/* 빠른 액션 */}
      <section className="grid grid-cols-2 gap-3">
        <button 
          className="btn-primary"
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '+ 습관 추가'}
        </button>
        <button className="btn-secondary">
          🎁 보상 확인
        </button>
      </section>
    </div>
  );
}