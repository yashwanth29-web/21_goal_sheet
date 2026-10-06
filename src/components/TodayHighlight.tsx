import React, { useEffect, useRef } from 'react';
import type { CalendarDay } from '../utils/dateUtils';
import type { ScheduleSlot, StatusRecordsMap } from '../types';
import { CheckCircle2, AlertCircle, XCircle, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TodayHighlightProps {
  todayDay: CalendarDay;
  slots: ScheduleSlot[];
  statusRecords: StatusRecordsMap;
  isCheatDay?: boolean;
  onToggleCheatDay?: () => void;
  onJumpToToday: () => void;
  onMarkAllTodayCompleted: () => void;
}

export const TodayHighlight: React.FC<TodayHighlightProps> = ({
  todayDay,
  slots,
  statusRecords,
  isCheatDay = false,
  onToggleCheatDay,
  onJumpToToday,
}) => {
  const previousAchievementRef = useRef<number>(0);

  let completed = 0;
  let partial = 0;
  let missed = 0;

  slots.forEach((slot) => {
    const key = `${todayDay.dateKey}_${slot.id}`;
    const status = statusRecords[key]?.status || 'none';
    if (status === 'completed') completed++;
    else if (status === 'partial') partial++;
    else if (status === 'missed') missed++;
  });

  const totalGoals = slots.length;
  const achievementRate = totalGoals > 0 ? Math.round(((completed + partial * 0.5) / totalGoals) * 100) : 0;

  useEffect(() => {
    if (!isCheatDay && achievementRate === 100 && totalGoals > 0 && previousAchievementRef.current < 100) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#f59e0b', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    }
    previousAchievementRef.current = achievementRate;
  }, [achievementRate, totalGoals, isCheatDay]);

  return (
    <div
      className={`w-full rounded-2xl border p-4 sm:p-5 shadow-md dark:shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        isCheatDay
          ? 'border-amber-300 dark:border-amber-500/40 bg-gradient-to-r from-amber-50 via-white to-orange-50 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-orange-950/30'
          : 'border-indigo-200 dark:border-indigo-500/40 bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-purple-950/30 dark:shadow-indigo-950/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm ${
            isCheatDay
              ? 'bg-amber-100 dark:bg-amber-600/30 border border-amber-300 dark:border-amber-400/30'
              : 'bg-indigo-100 dark:bg-indigo-600/30 border border-indigo-300 dark:border-indigo-400/30 dark:shadow-[0_0_15px_rgba(99,102,241,0.3)]'
          }`}
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isCheatDay ? 'text-amber-800 dark:text-amber-300' : 'text-indigo-700 dark:text-indigo-300'
            }`}
          >
            {todayDay.monthNameShort}
          </span>
          <span
            className={`text-lg font-black font-mono leading-none ${
              isCheatDay ? 'text-amber-950 dark:text-white' : 'text-indigo-900 dark:text-white'
            }`}
          >
            {todayDay.dayOfMonth}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${
                isCheatDay ? 'text-amber-700 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-ping ${
                  isCheatDay ? 'bg-amber-500 dark:bg-amber-400' : 'bg-indigo-500 dark:bg-indigo-400'
                }`}
              />
              {isCheatDay ? 'TODAY — CHEAT DAY / HOLIDAY 🌴' : `TODAY — ${todayDay.formattedDisplay.toUpperCase()}`}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({todayDay.dayNameFull})</span>
          </div>

          {isCheatDay ? (
            <p className="mt-1 text-xs text-amber-800 dark:text-amber-300/90 font-medium">
              Enjoy your rest day! This day is excluded from your monthly target goals.
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-mono">
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{totalGoals} Goals</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {completed} Completed
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                {partial} Partial
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                <XCircle className="w-3.5 h-3.5" />
                {missed} Missed
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Today's Achievement:</span>
            <span
              className={`text-lg sm:text-xl font-black font-mono ${
                achievementRate >= 80
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : achievementRate >= 50
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-indigo-600 dark:text-indigo-300'
              }`}
            >
              {achievementRate}%
            </span>
          </div>
          <div className="w-36 bg-slate-200 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden flex gap-0.5 mt-1">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${totalGoals > 0 ? (completed / totalGoals) * 100 : 0}%` }}
            />
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${totalGoals > 0 ? (partial / totalGoals) * 100 : 0}%` }}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${totalGoals > 0 ? (missed / totalGoals) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onToggleCheatDay && (
            <button
              type="button"
              onClick={onToggleCheatDay}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                isCheatDay
                  ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-100 border border-amber-400 dark:border-amber-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:text-amber-800 dark:hover:bg-amber-950/40 dark:hover:text-amber-300'
              }`}
              title={isCheatDay ? 'Restore today as an active goal target day' : 'Mark today as Cheat Day / Holiday (Excluded from monthly target)'}
            >
              <span>🌴</span>
              <span>{isCheatDay ? 'Restore Active Day' : 'Set Cheat Day'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onJumpToToday}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-300 dark:bg-indigo-600/30 dark:hover:bg-indigo-600/50 dark:border-indigo-500/50 dark:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Scroll timetable down to today's row"
          >
            <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300" />
            <span>Jump to Row</span>
          </button>
        </div>
      </div>
    </div>
  );
};
