interface HabitStatisticsProps {
  habitCount: number;
  completionRate: number;
  streak: number;
}

export function HabitStatistics({ habitCount, completionRate, streak }: HabitStatisticsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="card text-center">
        <span className="text-3xl mb-2" aria-hidden="true">📅</span>
        <p className="text-heading-lg font-bold text-gray-700">{habitCount}개</p>
        <span className="sr-only">총 습관 수: {habitCount}개</span>
      </div>
      <div className="card text-center">
        <span className="text-3xl mb-2" aria-hidden="true">🎯</span>
        <p className="text-heading-lg font-bold text-gray-700">완료율 {completionRate}%</p>
        <span className="sr-only">주간 완료율: {completionRate}퍼센트</span>
      </div>
      <div className="card text-center">
        <span className="text-3xl mb-2" aria-hidden="true">🔥</span>
        <p className="text-heading-lg font-bold text-gray-700">스트릭 {streak}일</p>
        <span className="sr-only">연속 달성: {streak}일</span>
      </div>
    </div>
  );
}
