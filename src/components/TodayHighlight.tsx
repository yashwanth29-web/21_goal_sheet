import React, { useEffect, useRef } from 'react';
import type { CalendarDay } from '../utils/dateUtils';
import type { ScheduleSlot, StatusRecordsMap } from '../types';
import { ArrowRight } from 'lucide-react';
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

  // SVG Circular progress radius
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (achievementRate / 100) * circumference;

  return (
    <div
      className={`w-full rounded-2xl border p-3.5 sm:p-4 shadow-md dark:shadow-xl backdrop-blur-xl transition-all ${
        isCheatDay
          ? 'border-amber-300 dark:border-amber-500/40 bg-gradient-to-r from-amber-50 via-white to-orange-50 dark:from-amber-950/40 dark:via-slate-900/80 dark:to-orange-950/30'
          : 'border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 dark:from-indigo-950/40 dark:via-slate-900/80 dark:to-purple-950/30'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Circular Progress Ring & Numbers */}
        <div className="flex items-center gap-3">
          {/* Circular Progress Gauge */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="4.5"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                className={`transition-all duration-700 ease-out ${
                  isCheatDay
                    ? 'stroke-amber-500'
                    : achievementRate >= 80
                    ? 'stroke-emerald-500'
                    : achievementRate >= 40
                    ? 'stroke-indigo-500'
                    : 'stroke-indigo-400'
                }`}
                strokeWidth="4.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-black font-mono text-slate-900 dark:text-white leading-none">
                {achievementRate}%
              </span>
            </div>
          </div>

          {/* Today Info & Stats breakdown */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                TODAY • {todayDay.formattedDisplay.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({todayDay.dayNameShort})</span>
            </div>

            {isCheatDay ? (
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1">
                <span>🌴 Rest / Cheat Day Active</span>
              </p>
            ) : (
              <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">{totalGoals} Goals</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{completed} Done</span>
                <span>•</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">{missed} Missed</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Cheat Day & Jump to Table Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleCheatDay && (
            <button
              type="button"
              onClick={onToggleCheatDay}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs ${
                isCheatDay
                  ? 'bg-amber-500 text-white shadow-amber-500/30 ring-2 ring-amber-400/40'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
              title={isCheatDay ? 'Restore today as active target day' : 'Mark today as Cheat Day / Holiday'}
            >
              <span>🌴</span>
              <span className="hidden sm:inline">{isCheatDay ? 'Active Day' : 'Cheat Day'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onJumpToToday}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Switch to full 31-day Timetable grid"
          >
            <span>Grid</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
