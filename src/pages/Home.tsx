import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser, useHabits, useDailyChecks, useRewards, useGameEvents } from '../hooks';
import { getHabitIcon } from '../utils/habitIcon';
import type { Habit } from '../types';

export function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { habits } = useHabits(user.id);
  const { checkHabit, uncheckHabit, isTodayChecked, getCheckedDatesThisWeek } = useDailyChecks(user.id);
  const { availableBoxes } = useRewards(user.id);
  const gameEvents = useGameEvents();

  // "보상까지 N일" 실제 계산
  const daysUntilReward = useMemo(() => {
    if (habits.length === 0) return 0;

    // 이번 주 남은 체크 수 합산
    let totalRemaining = 0;
    for (const habit of habits) {
      const checked = getCheckedDatesThisWeek(habit.id).length;
      const remaining = Math.max(0, (habit.weekly_target || 5) - checked);
      totalRemaining += remaining;
    }

    // 남은 체크를 하루에 최대 습관 수만큼 할 수 있다고 가정
    return habits.length > 0 ? Math.ceil(totalRemaining / habits.length) : 0;
  }, [habits, getCheckedDatesThisWeek]);

  const handleToggleCheck = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (isTodayChecked(habitId)) {
      await uncheckHabit(habitId, today);
    } else {
      await checkHabit(habitId, today);
      // 게임 이벤트 처리 (경험치, 스트릭, 업적)
      await gameEvents.processHabitCheck(habitId, user.id);
      // 주간 목표 달성 체크
      await gameEvents.processWeeklyTarget(user.id, habits);
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
          <button
            onClick={() => navigate('/rewards')}
            className="flex items-center justify-center rounded-full size-10 bg-white text-[#1A1C1E] ios-shadow relative"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {availableBoxes.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full size-5 flex items-center justify-center">
                {availableBoxes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* User Stats Bar */}
      <motion.div
        className="mx-6 mb-2 flex items-center justify-between bg-white rounded-2xl px-4 py-3 ios-shadow"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Lv.{user.level}</span>
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-highlight rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(user.exp % 100)}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-600">
            <span className="material-symbols-outlined text-base text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            {user.streak}일
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-slate-600">
            <span className="material-symbols-outlined text-base text-primary">redeem</span>
            {availableBoxes.length}
          </span>
        </div>
      </motion.div>

      {/* Reward Box Section */}
      <motion.div
        className="mx-6 my-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate('/rewards')}
          className={`w-full rounded-3xl p-5 flex items-center gap-4 cursor-pointer transition-all active:scale-[0.98] ${
            availableBoxes.length > 0
              ? 'bg-gradient-to-r from-highlight to-cat-orange text-white ios-shadow-lg'
              : 'bg-white ios-shadow'
          }`}
        >
          <div className="relative flex-shrink-0">
            <div className={`size-14 rounded-2xl flex items-center justify-center ${
              availableBoxes.length > 0 ? 'bg-white/20' : 'bg-primary/10'
            }`}>
              <span className={`material-symbols-outlined text-3xl ${
                availableBoxes.length > 0 ? 'text-white' : 'text-primary'
              }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                redeem
              </span>
            </div>
            {availableBoxes.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-highlight text-[11px] font-black rounded-full size-5 flex items-center justify-center">
                {availableBoxes.length}
              </span>
            )}
          </div>
          <div className="text-left flex-1">
            <p className={`font-bold text-base leading-tight ${availableBoxes.length > 0 ? 'text-white' : 'text-[#1A1C1E]'}`}>
              {availableBoxes.length > 0
                ? `보상 상자 ${availableBoxes.length}개 열기!`
                : daysUntilReward > 0
                  ? `보상까지 ${daysUntilReward}일 남았어요`
                  : '이번 주 목표 달성!'}
            </p>
            <p className={`text-sm mt-0.5 ${availableBoxes.length > 0 ? 'text-white/80' : 'text-slate-400'}`}>
              {availableBoxes.length > 0 ? '탭해서 지금 열어보세요' : '조금만 더 힘내세요!'}
            </p>
          </div>
          <span className={`material-symbols-outlined ${availableBoxes.length > 0 ? 'text-white/70' : 'text-slate-300'}`}>
            chevron_right
          </span>
        </button>
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
            habits.map((habit: Habit, index: number) => {
              const progress = getWeeklyProgress(habit.id, habit.weekly_target || 5);
              const progressPercent = Math.min((progress.completed / progress.total) * 100, 100);
              const isCheckedToday = isTodayChecked(habit.id);
              const iconName = getHabitIcon(habit.name);

              return (
                <motion.div
                  key={habit.id}
                  className="glass-card p-5 ios-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {/* 체크 버튼 — 44x44px 터치 타겟 */}
                    <button
                      onClick={() => handleToggleCheck(habit.id)}
                      disabled={gameEvents.isProcessing}
                      className={`size-11 rounded-2xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200 active:scale-90 ${
                        isCheckedToday
                          ? 'bg-gradient-to-br from-primary to-highlight text-white shadow-[0_4px_12px_rgba(62,148,228,0.35)]'
                          : 'bg-gray-100 text-gray-300 hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isCheckedToday ? "'FILL' 1" : "'FILL' 0" }}>
                        check_circle
                      </span>
                    </button>
                    <div className="icon-circle flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">{iconName}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isCheckedToday ? 'text-slate-400 line-through' : 'text-[#1A1C1E]'}`}>
                        {habit.name}
                      </p>
                      <p className="text-[11px] text-slate-400">주 {habit.weekly_target || 5}회 목표</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-base font-extrabold ${progress.completed >= progress.total ? 'text-primary' : 'text-[#1A1C1E]'}`}>
                        {progress.completed}<span className="text-slate-300 font-normal">/{progress.total}</span>
                      </span>
                      <span className={`text-[10px] block font-bold ${progress.completed >= progress.total ? 'text-primary' : 'text-slate-400'}`}>
                        {progress.completed >= progress.total ? '완료!' : '진행중'}
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
