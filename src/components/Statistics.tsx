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
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
      {/* 1. Target Goals Card */}
      <div className="rounded-xl p-2 sm:p-2.5 border border-slate-200 dark:border-slate-800/80 shadow-xs bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            Target Goals
          </span>
          <span className="p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
            <Target className="w-2.5 h-2.5" />
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-1">
          <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
            {stats.totalGoals}
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{monthName.split(' ')[0]}</span>
        </div>
        <div className="mt-0.5 flex items-center text-[9px] text-slate-500 dark:text-slate-400 truncate">
          {stats.cheatDaysCount > 0 ? (
            <span className="text-amber-700 dark:text-amber-400 font-semibold truncate text-[9px]">
              🌴 {stats.cheatDaysCount} Cheat ({stats.activeDays} Active)
            </span>
          ) : (
            <span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{trackedCount}</span> tracked
            </span>
          )}
        </div>
      </div>

      {/* 2. Completed Card */}
      <div className="rounded-xl p-2 sm:p-2.5 border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/15 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9.5px] font-bold text-emerald-800 dark:text-emerald-300/90 uppercase tracking-wider truncate">
            Completed
          </span>
          <span className="p-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 shrink-0">
            <CheckCircle2 className="w-2.5 h-2.5" />
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-1">
          <span className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </span>
          {trackedCount > 0 && (
            <span className="text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400/80">
              {Math.round((stats.completed / (trackedCount || 1)) * 100)}%
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 h-1 rounded-full overflow-hidden mt-1">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${trackedCount > 0 ? (stats.completed / trackedCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 3. Partial Card */}
      <div className="rounded-xl p-2 sm:p-2.5 border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/15 shadow-xs hover:border-amber-300 dark:hover:border-amber-700/50 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9.5px] font-bold text-amber-800 dark:text-amber-300/90 uppercase tracking-wider truncate">
            Partial
          </span>
          <span className="p-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shrink-0">
            <AlertCircle className="w-2.5 h-2.5" />
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-1">
          <span className="text-base sm:text-lg font-black font-mono text-amber-600 dark:text-amber-400">
            {stats.partial}
          </span>
          {trackedCount > 0 && (
            <span className="text-[9.5px] font-bold text-amber-700 dark:text-amber-400/80">
              {Math.round((stats.partial / (trackedCount || 1)) * 100)}%
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 h-1 rounded-full overflow-hidden mt-1">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${trackedCount > 0 ? (stats.partial / trackedCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 4. Missed Card */}
      <div className="rounded-xl p-2 sm:p-2.5 border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/15 shadow-xs hover:border-rose-300 dark:hover:border-rose-700/50 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9.5px] font-bold text-rose-800 dark:text-rose-300/90 uppercase tracking-wider truncate">
            Missed
          </span>
          <span className="p-0.5 rounded-md bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 shrink-0">
            <XCircle className="w-2.5 h-2.5" />
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-1">
          <span className="text-base sm:text-lg font-black font-mono text-rose-600 dark:text-rose-400">
            {stats.missed}
          </span>
          {trackedCount > 0 && (
            <span className="text-[9.5px] font-bold text-rose-700 dark:text-rose-400/80">
              {Math.round((stats.missed / (trackedCount || 1)) * 100)}%
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 h-1 rounded-full overflow-hidden mt-1">
          <div
            className="bg-rose-500 h-full transition-all duration-300"
            style={{ width: `${trackedCount > 0 ? (stats.missed / trackedCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 5. Achievement Rate Card */}
      <div className="col-span-2 sm:col-span-3 lg:col-span-1 rounded-xl p-2 sm:p-2.5 border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-400/50 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9.5px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider truncate">
            Achievement Rate
          </span>
          <span className="p-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shrink-0">
            <Award className="w-2.5 h-2.5" />
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-1">
          <span className="text-base sm:text-lg font-black font-mono text-indigo-600 dark:text-indigo-300">
            {stats.achievementRate}%
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">score</span>
        </div>
        <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 h-1 rounded-full overflow-hidden mt-1">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
            style={{ width: `${stats.achievementRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
