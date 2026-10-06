import React from 'react';
import { Target, CheckCircle2, AlertCircle, XCircle, Award } from 'lucide-react';
import type { MonthStatistics } from '../types';

interface StatisticsProps {
  stats: MonthStatistics;
  monthName: string;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats, monthName }) => {
  const trackedCount = stats.completed + stats.partial + stats.missed;

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
      {/* 1. Target Goals Card */}
      <div className="rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-sm hover:shadow-md dark:shadow-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            Target Goals
          </span>
          <span className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
            <Target className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-1">
          <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats.totalGoals}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">{monthName.split(' ')[0]}</span>
        </div>
        <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-slate-400 truncate">
          {stats.cheatDaysCount > 0 ? (
            <span className="text-amber-700 dark:text-amber-400 font-semibold truncate text-[11px]">
              🌴 {stats.cheatDaysCount} Cheat ({stats.activeDays} Active)
            </span>
          ) : (
            <span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{trackedCount}</span> tracked
            </span>
          )}
        </div>
      </div>

      {/* 2. Completed Card */}
      <div className="rounded-2xl p-3.5 sm:p-4 border border-emerald-200/90 dark:border-emerald-800/40 bg-gradient-to-b from-emerald-50/60 to-white dark:from-emerald-950/30 dark:to-slate-900/90 shadow-sm hover:shadow-md dark:shadow-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider truncate">
            Completed
          </span>
          <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-1">
          <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </span>
          {trackedCount > 0 && (
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {Math.round((stats.completed / (trackedCount || 1)) * 100)}%
            </span>
          )}
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 sm:h-2 rounded-full overflow-hidden mt-2">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${trackedCount > 0 ? (stats.completed / trackedCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 3. Partial Card */}
      <div className="rounded-2xl p-3.5 sm:p-4 border border-amber-200/90 dark:border-amber-800/40 bg-gradient-to-b from-amber-50/60 to-white dark:from-amber-950/30 dark:to-slate-900/90 shadow-sm hover:shadow-md dark:shadow-amber-950/20 hover:border-amber-300 dark:hover:border-amber-700/60 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider truncate">
            Partial
          </span>
          <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-1">
          <span className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {stats.partial}
          </span>
          {trackedCount > 0 && (
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {Math.round((stats.partial / (trackedCount || 1)) * 100)}%
            </span>
          )}
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 sm:h-2 rounded-full overflow-hidden mt-2">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${trackedCount > 0 ? (stats.partial / trackedCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 4. Missed Card */}
      <div className="rounded-2xl p-3.5 sm:p-4 border border-rose-200/90 dark:border-rose-800/40 bg-gradient-to-b from-rose-50/60 to-white dark:from-rose-950/30 dark:to-slate-900/90 shadow-sm hover:shadow-md dark:shadow-rose-950/20 hover:border-rose-300 dark:hover:border-rose-700/60 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider truncate">
            Missed
          </span>
          <span className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 shrink-0">
            <XCircle className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-1">
          <span className="text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {stats.missed}
          </span>
          {trackedCount > 0 && (
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
              {Math.round((stats.missed / (trackedCount || 1)) * 100)}%
            </span>
          )}
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 sm:h-2 rounded-full overflow-hidden mt-2">
          <div
            className="bg-rose-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${trackedCount > 0 ? (stats.missed / trackedCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 5. Achievement Rate Card */}
      <div className="col-span-2 sm:col-span-3 lg:col-span-1 rounded-2xl p-3.5 sm:p-4 border border-indigo-200/90 dark:border-indigo-500/30 bg-gradient-to-b from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-slate-900/90 shadow-sm hover:shadow-md dark:shadow-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-400/60 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider truncate">
            Achievement Rate
          </span>
          <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shrink-0">
            <Award className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-1">
          <span className="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-300">
            {stats.achievementRate}%
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Monthly</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 sm:h-2 rounded-full overflow-hidden mt-2">
          <div
            className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.achievementRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
