interface WeeklyProgressProps {
  habitId: string;
  habitName: string;
  progress: number;
  weekDates: string[];
  weekDays: string[];
  isDateChecked: (habitId: string, date: string) => boolean;
  onToggleCheck: (habitId: string, date: string) => void;
}

export function WeeklyProgress({
  habitId,
  habitName,
  progress,
  weekDates,
  weekDays,
  isDateChecked,
  onToggleCheck,
}: WeeklyProgressProps) {
  return (
    <>
      {/* 주간 진행률 */}
      <div className="mt-3">
        <div className="flex justify-between text-body-sm mb-1">
          <span>이번 주 진행률</span>
          <span className="font-heading-md">{progress.toFixed(0)}%</span>
        </div>
        <div
          className="progress-bar-cat"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${habitName} 주간 진행률`}
        >
          <div
            className="progress-fill-cat"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 주간 체크박스 */}
      <div className="grid grid-cols-7 gap-1 mt-3" role="group" aria-label={`${habitName} 주간 체크 상태`}>
        {weekDates.map((date, index) => {
          const weekDay = weekDays[index];
          const isChecked = isDateChecked(habitId, date);
          const isPast = new Date(date) < new Date(new Date().setDate(new Date().getDate() - 1));

          return (
            <div
              key={`${habitId}-${index}`}
              className={`aspect-square flex items-center justify-center text-xs rounded border ${
                isChecked
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
                } ${
                isPast && !isChecked ? 'opacity-50' : ''
                } ${!isPast && !isChecked ? 'cursor-pointer hover:bg-gray-200' : ''}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleCheck(habitId, date)}
                className="sr-only"
                aria-label={`${habitName} ${weekDay}요일 ${isChecked ? '완료됨' : '미완료'}`}
              />
              <label
                className="w-full h-full flex items-center justify-center rounded cursor-pointer"
                onClick={() => onToggleCheck(habitId, date)}
              >
                {weekDay}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
}
