import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser, useHabits, useDailyChecks } from '../hooks';

const HABIT_ICONS: Record<string, string> = {
  'water_drop': 'water_drop',
  'fitness_center': 'fitness_center',
  'menu_book': 'menu_book',
  'self_improvement': 'self_improvement',
  'directions_run': 'directions_run',
  'restaurant': 'restaurant',
  'bedtime': 'bedtime',
  'code': 'code',
};

function getHabitIcon(name: string): string {
  if (name.includes('물') || name.includes('water')) return 'water_drop';
  if (name.includes('운동') || name.includes('헬스')) return 'fitness_center';
  if (name.includes('책') || name.includes('독서')) return 'menu_book';
  if (name.includes('명상') || name.includes('meditation')) return 'self_improvement';
  if (name.includes('달리기') || name.includes('걷기')) return 'directions_run';
  if (name.includes('식사') || name.includes('다이어트')) return 'restaurant';
  if (name.includes('수면') || name.includes('잠')) return 'bedtime';
  if (name.includes('코딩') || name.includes('공부')) return 'code';
  return 'check_circle';
}

export function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { habits } = useHabits(user?.id);
  const { checkHabit, uncheckHabit, isTodayChecked, getCheckedDatesThisWeek } = useDailyChecks();
  const [daysUntilReward] = useState(2);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleToggleCheck = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (isTodayChecked(habitId)) {
      await uncheckHabit(habitId, today);
    } else {
      await checkHabit(habitId, today);
    }
  };

  const getWeeklyProgress = (habitId: string, weeklyTarget: number) => {
    const thisWeekChecks = getCheckedDatesThisWeek(habitId);
    return { completed: thisWeekChecks.length, total: weeklyTarget };
  };

  return (
    <div className="relative flex min-h-screen w-full max-w-[480px] mx-auto flex-col overflow-x-hidden bg-background-light pb-44 page-enter">
      {/* Header */}
      <div className="flex items-center p-6 pb-2 justify-between">
        <div className="text-primary flex size-10 items-center justify-center bg-white rounded-full ios-shadow">
          <span className="material-symbols-outlined text-xl">calendar_month</span>
        </div>
        <h2 className="text-[#1A1C1E] text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          나의 목표 대시보드
        </h2>
        <div className="flex w-10 items-center justify-end">
          <button className="flex items-center justify-center rounded-full size-10 bg-white text-[#1A1C1E] ios-shadow">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
        </div>
      </div>

      {/* Reward Box Section */}
      <motion.div
        className="flex flex-col items-center justify-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex flex-col items-center">
          <div className="relative size-32 flex items-center justify-center">
            <span className="material-symbols-outlined !text-[80px] text-primary/40 font-extralight">
              redeem
            </span>
            <div className="absolute -top-1 -right-1">
              <div className="bg-highlight size-3 rounded-full animate-ping absolute"></div>
              <div className="bg-highlight size-3 rounded-full relative"></div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-[#1A1C1E] text-lg font-bold leading-tight">
              보상까지 {daysUntilReward}일 남았어요
            </h3>
            <p className="text-slate-500 text-sm font-medium mt-1">
              조금만 더 힘내세요!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Habits Section */}
      <div className="px-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-[#1A1C1E]">이번 주 목표 달성현황</h4>
          <button
            className="text-primary text-sm font-bold"
            onClick={() => navigate('/habits')}
          >
            편집
          </button>
        </div>

        <div className="space-y-4">
          {habits.length === 0 ? (
            <motion.div
              className="glass-card rounded-2xl p-8 ios-shadow text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                add_task
              </span>
              <p className="text-slate-500 font-medium">
                아직 등록된 습관이 없어요
              </p>
              <p className="text-slate-400 text-sm mt-1">
                아래 버튼을 눌러 첫 습관을 추가해보세요!
              </p>
            </motion.div>
          ) : (
            habits.map((habit, index) => {
              const progress = getWeeklyProgress(habit.id, habit.weekly_target || 5);
              const progressPercent = Math.min((progress.completed / progress.total) * 100, 100);
              const isCheckedToday = isTodayChecked(habit.id);
              const iconName = getHabitIcon(habit.name);

              return (
                <motion.div
                  key={habit.id}
                  className="glass-card rounded-2xl p-5 ios-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="checkbox"
                      checked={isCheckedToday}
                      onChange={() => handleToggleCheck(habit.id)}
                      className="cursor-pointer"
                    />
                    <div className="icon-circle">
                      <span className="material-symbols-outlined text-2xl">{iconName}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#1A1C1E] text-sm">{habit.name}</p>
                      <p className="text-[11px] text-slate-400">
                        주 {habit.weekly_target || 5}회 목표
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-[#1A1C1E]">
                        {progress.completed} / {progress.total}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {progress.completed >= progress.total ? '완료!' : '완료'}
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto pointer-events-none z-50">
        <div className="p-6 pointer-events-auto">
          <motion.button
            onClick={() => navigate('/habits')}
            className="btn-primary"
            whileHover={{ scale: 0.99 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="material-symbols-outlined mr-2">add</span>
            할 일 추가하기
          </motion.button>
        </div>
      </div>
    </div>
  );
}
