import { useState, useEffect } from 'react';
import { useHabits, useDailyChecks, useUser } from '../hooks';
import type { Habit } from '../types';

export function HabitsPage() {
  const { user } = useUser();
  const { habits, createHabit, updateHabit, deleteHabit, isCreating } = useHabits(user?.id);
  const { checkHabit, uncheckHabit, isTodayChecked, isDateChecked, getCheckedDatesThisWeek, isChecking } = useDailyChecks();

  // 폼 상태 관리
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // 새 습관 폼 상태
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTarget, setNewHabitTarget] = useState(3);

  // 폼 닫기 핸들러
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHabit(null);
    setNewHabitName('');
    setNewHabitTarget(3);
  };

  const handleCreateHabit = async (habitData: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => {
    await createHabit(habitData);
    handleCloseForm();
    console.log('습관 생성:', habitData);
  };

  const handleUpdateHabit = async (habit: Habit) => {
    await updateHabit(habit.id, { 
      name: habit.name, 
      weekly_target: habit.weekly_target 
    });
    setEditingHabit(null);
    console.log('습관 수정:', habit);
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (window.confirm('정말로 이 습관을 삭제하시겠습니까?')) {
      await deleteHabit(habitId);
      console.log('습관 삭제:', habitId);
    }
  };

  const handleCheck = async (habitId: string, date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const isChecked = isTodayChecked(habitId);
    
    if (isChecked) {
      await uncheckHabit(habitId, targetDate);
    } else {
      await checkHabit(habitId, targetDate);
    }
  };

  // 주간 진행률 계산
  const getWeeklyProgress = (habit: Habit) => {
    if (!habit.weekly_target) return 0;
    
    const thisWeekChecks = getCheckedDatesThisWeek(habit.id);
    const progress = Math.min((thisWeekChecks.length / habit.weekly_target) * 100, 100);
    
    return progress;
  };

  // 이번 주 시작일과 끝일 계산
  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];

  // 이미 로그인된 경우 메인 페이지로 이동
  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* 페이지 헤더 */}
      <div className="text-center mb-8">
        <span className="text-6xl animate-bounce-slow">🐱</span>
        <h1 className="font-heading text-gray-800 mt-4">내 습관</h1>
      </div>

      {/* 습관 통계 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card text-center">
          <span className="text-3xl mb-2">📅</span>
          <p className="text-heading-lg font-bold text-gray-700">{habits.length}개</p>
        </div>
        <div className="card text-center">
          <span className="text-3xl mb-2">🎯</span>
          <p className="text-heading-lg font-bold text-gray-700">완료율 {Math.round(
            habits.length > 0 ?
              habits.reduce((total, habit) => total + getWeeklyProgress(habit), 0) / habits.length :
              0
          )}%
          </p>
        </div>
        <div className="card text-center">
          <span className="text-3xl mb-2">🔥</span>
          <p className="text-heading-lg font-bold text-gray-700">스트릭 {user?.streak || 0}일</p>
        </div>
      </div>

      {/* 습관 목록 */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-body-lg text-gray-500">아직 습관이 없습니다.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-cat mt-4"
            >
              + 첫 습관
            </button>
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="card-habit">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="text-2xl mb-1">
                      {habit.name === '운동하기' ? '🏃' :
                       habit.name === '독서하기' ? '📚' :
                       habit.name === '명상' ? '🧘' :
                       habit.name === '운동' ? '💪' : '🐱'}
                    </div>
                    <div className="ml-2">
                      <h3 className="font-heading">{habit.name}</h3>
                      <p className="text-body-sm text-gray-500">주 {habit.weekly_target}회 목표</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCheck(habit.id)}
                    disabled={isChecking}
                    className={`btn-icon text-lg ${
                      isTodayChecked(habit.id)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-primary-100'
                    }`}
                  >
                    {isTodayChecked(habit.id) ? '✅' : '⭕'}
                  </button>
                  <button
                    onClick={() => setEditingHabit(habit)}
                    className="btn-icon"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="btn-icon text-error-500"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* 주간 진행률 */}
              <div className="mt-3">
                <div className="flex justify-between text-body-sm mb-1">
                  <span>이번 주 진행률</span>
                  <span className="font-heading-md">{getWeeklyProgress(habit).toFixed(0)}%</span>
                </div>
                <div className="progress-bar-cat">
                  <div
                    className="progress-fill-cat"
                    style={{ width: `${getWeeklyProgress(habit)}%` }}
                  />
                </div>
              </div>

              {/* 주간 체크박스 */}
              <div className="grid grid-cols-7 gap-1 mt-3">
                {getWeekDates().map((date, index) => {
                  const weekDay = weekDays[index];
                  const isChecked = isDateChecked(habit.id, date);
                  const isPast = new Date(date) < new Date(new Date().setDate(new Date().getDate() - 1));
                  
                  return (
                    <div key={`${habit.id}-${index}`} className={`aspect-square flex items-center justify-center text-xs rounded border ${
                      isChecked 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                      } ${
                      isPast && !isChecked ? 'opacity-50' : ''
                      } ${!isPast && !isChecked ? 'cursor-pointer hover:bg-gray-200' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheck(habit.id, date)}
                        className="sr-only"
                      />
                      <label className="w-full h-full flex items-center justify-center rounded">
                        {weekDay}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 생성/편집 폼 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-gray-800">
                {editingHabit ? '습관 수정' : '새 습관'}
              </h3>
              <button
                onClick={handleCloseForm}
                className="btn-icon"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingHabit) {
                handleUpdateHabit(editingHabit);
              } else {
                handleCreateHabit({
                  name: newHabitName,
                  weekly_target: newHabitTarget,
                  user_id: user!.id,
                  is_active: true
                });
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-body font-medium text-gray-700 mb-2">
                    습관 이름
                  </label>
                  <input
                    type="text"
                    value={editingHabit?.name || newHabitName}
                    onChange={(e) => {
                      if (editingHabit) {
                        setEditingHabit({...editingHabit, name: e.target.value});
                      } else {
                        setNewHabitName(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="예: 운동하기"
                    required
                  />
                </div>

                <div>
                  <label className="block text-body font-medium text-gray-700 mb-2">
                    주 목표
                  </label>
                  <select
                    value={editingHabit?.weekly_target || newHabitTarget}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (editingHabit) {
                        setEditingHabit({...editingHabit, weekly_target: value});
                      } else {
                        setNewHabitTarget(value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  required
                  >
                    <option value="1">주 1회</option>
                    <option value="2">주 2회</option>
                    <option value="3">주 3회</option>
                    <option value="4">주 4회</option>
                    <option value="5">주 5회</option>
                    <option value="6">주 6회</option>
                    <option value="7">주 7회</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full btn-primary mt-4"
            >
              {isCreating ? '생성 중...' : (editingHabit ? '수정' : '생성')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}