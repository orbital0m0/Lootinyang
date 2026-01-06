export function Achievements() {
  return (
    <div className="p-4 space-y-4">
      {/* 페이지 헤더 */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">🏆 업적</h2>
        <p className="text-sm text-gray-600">
          달성한 업적과 진행상황을 확인하세요!
        </p>
      </div>

      {/* 업적 카테고리 */}
      <div className="space-y-4">
        {/* 도전 과제 */}
        <div>
          <h3 className="font-semibold mb-3">🎯 도전 과제</h3>
          <div className="space-y-2">
            <div className="card-achievement">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👶</span>
                <div className="flex-1">
                  <h4 className="font-medium">첫걸음</h4>
                  <p className="text-sm text-gray-500">첫 습관을 생성했어요</p>
                </div>
                <span className="text-sm text-green-500 font-medium">✅ 완료</span>
              </div>
            </div>

            <div className="card-achievement">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📚</span>
                <div className="flex-1">
                  <h4 className="font-medium">습관 수집가</h4>
                  <p className="text-sm text-gray-500">5개의 습관을 생성했어요</p>
                </div>
                <span className="text-sm text-gray-500">3/5</span>
              </div>
              <div className="mt-2">
                <div className="progress-bar h-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: '60%' }}
                  />
                </div>
              </div>
            </div>

            <div className="card-achievement opacity-75">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏅</span>
                <div className="flex-1">
                  <h4 className="font-medium">3주 연속 성공</h4>
                  <p className="text-sm text-gray-500">3주 연속으로 주간 목표를 달성했어요</p>
                </div>
                <span className="text-sm text-gray-500">1/3주차</span>
              </div>
              <div className="mt-2">
                <div className="progress-bar h-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: '33%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 꾸준함 */}
        <div>
          <h3 className="font-semibold mb-3">🔥 꾸준함</h3>
          <div className="space-y-2">
            <div className="card-achievement">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📅</span>
                <div className="flex-1">
                  <h4 className="font-medium">일주일 꾸준함</h4>
                  <p className="text-sm text-gray-500">7일 연속 습관을 달성했어요</p>
                </div>
                <span className="text-sm text-green-500 font-medium">✅ 완료</span>
              </div>
            </div>

            <div className="card-achievement opacity-75">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📆</span>
                <div className="flex-1">
                  <h4 className="font-medium">한달의 달인</h4>
                  <p className="text-sm text-gray-500">30일 연속 습관을 달성했어요</p>
                </div>
                <span className="text-sm text-gray-500">7/30일</span>
              </div>
              <div className="mt-2">
                <div className="progress-bar h-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: '23%' }}
                  />
                </div>
              </div>
            </div>

            <div className="card-achievement opacity-75">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💯</span>
                <div className="flex-1">
                  <h4 className="font-medium">완벽한 한달</h4>
                  <p className="text-sm text-gray-500">한달 동안 모든 습관을 100% 달성했어요</p>
                </div>
                <span className="text-sm text-gray-500">잠김</span>
              </div>
            </div>
          </div>
        </div>

        {/* 보상 헌터 */}
        <div>
          <h3 className="font-semibold mb-3">🎁 보상 헌터</h3>
          <div className="space-y-2">
            <div className="card-achievement">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎁</span>
                <div className="flex-1">
                  <h4 className="font-medium">보상 사냥꾼</h4>
                  <p className="text-sm text-gray-500">10개의 보상 상자를 열었어요</p>
                </div>
                <span className="text-sm text-gray-500">8/10</span>
              </div>
              <div className="mt-2">
                <div className="progress-bar h-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: '80%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 레전드 */}
        <div>
          <h3 className="font-semibold mb-3">⭐ 레전드</h3>
          <div className="space-y-2">
            <div className="card-achievement opacity-75">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <div className="flex-1">
                  <h4 className="font-medium">레전드 레벨</h4>
                  <p className="text-sm text-gray-500">레벨 50에 도달했어요</p>
                </div>
                <span className="text-sm text-gray-500">Lv.5/50</span>
              </div>
              <div className="mt-2">
                <div className="progress-bar h-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: '10%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 */}
      <div className="card text-center">
        <h3 className="font-semibold mb-3">📊 업적 통계</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-2xl font-bold text-green-500">3</p>
            <p className="text-xs text-gray-600">완료</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-500">4</p>
            <p className="text-xs text-gray-600">진행 중</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-500">1</p>
            <p className="text-xs text-gray-600">잠김</p>
          </div>
        </div>
      </div>

      {/* 업적 포인트 */}
      <div className="card text-center bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="text-2xl mb-1">⭐</div>
        <p className="text-sm font-medium text-gray-700">총 업적 포인트</p>
        <p className="text-3xl font-bold text-amber-600">60</p>
      </div>
    </div>
  );
}