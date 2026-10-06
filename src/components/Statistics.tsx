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
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* 1. Total Goals Card */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-lg relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-white dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Target Goals
          </span>
          <span className="p-2 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            <Target className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            {stats.totalGoals}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">in {monthName}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          {stats.cheatDaysCount > 0 ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold text-[10px]">
              🌴 {stats.cheatDaysCount} Cheat {stats.cheatDaysCount === 1 ? 'Day' : 'Days'} Excluded ({stats.activeDays} Active)
            </span>
          ) : (
            <span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{trackedCount}</span> tracked so far
            </span>
          )}
        </div>
      </div>

      {/* 2. Completed Card */}
      <div className="glass-card rounded-2xl p-4 border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-sm dark:shadow-lg relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300/80 uppercase tracking-wider">
            Completed
          </span>
          <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </span>
          {trackedCount > 0 && (
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400/80">
              ({Math.round((stats.completed / (trackedCount || 1)) * 100)}%)
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-1 rounded-full overflow-hidden mt-3">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${trackedCount > 0 ? (stats.completed / trackedCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 3. Partial Card */}
      <div className="glass-card rounded-2xl p-4 border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/10 shadow-sm dark:shadow-lg relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300/80 uppercase tracking-wider">
            Partial
          </span>
          <span className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            <AlertCircle className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {stats.partial}
          </span>
          {trackedCount > 0 && (
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400/80">
              ({Math.round((stats.partial / (trackedCount || 1)) * 100)}%)
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-1 rounded-full overflow-hidden mt-3">
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{ width: `${trackedCount > 0 ? (stats.partial / trackedCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 4. Missed Card */}
      <div className="glass-card rounded-2xl p-4 border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/10 shadow-sm dark:shadow-lg relative overflow-hidden group hover:border-rose-300 dark:hover:border-rose-700/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-800 dark:text-rose-300/80 uppercase tracking-wider">
            Missed
          </span>
          <span className="p-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
            <XCircle className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            {stats.missed}
          </span>
          {trackedCount > 0 && (
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400/80">
              ({Math.round((stats.missed / (trackedCount || 1)) * 100)}%)
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-1 rounded-full overflow-hidden mt-3">
          <div
            className="bg-rose-500 h-full transition-all duration-500"
            style={{ width: `${trackedCount > 0 ? (stats.missed / trackedCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 5. Achievement Rate Card */}
      <div className="col-span-2 sm:col-span-3 lg:col-span-1 glass-card rounded-2xl p-4 border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/60 dark:bg-indigo-950/20 shadow-sm dark:shadow-lg shadow-indigo-950/20 relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-400/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
            Achievement Rate
          </span>
          <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            <Award className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-300">
            {stats.achievementRate}%
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">consistency</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-1 rounded-full overflow-hidden mt-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${stats.achievementRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
