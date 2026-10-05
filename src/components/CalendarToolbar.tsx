import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search, X } from 'lucide-react';
import type { Period, GoalStatus } from '../types';

interface CalendarToolbarProps {
  currentMonthYearText: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPeriod: 'ALL' | Period;
  onPeriodChange: (p: 'ALL' | Period) => void;
  selectedStatus: 'ALL' | GoalStatus;
  onStatusChange: (s: 'ALL' | GoalStatus) => void;
  onResetFilters: () => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  currentMonthYearText,
  onPrevMonth,
  onNextMonth,
  onGoToday,
  searchQuery,
  onSearchChange,
  selectedPeriod,
  onPeriodChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery !== '' || selectedPeriod !== 'ALL' || selectedStatus !== 'ALL';

  return (
    <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl bg-white/90 dark:bg-slate-900/60">
      <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-inner">
          <button
            type="button"
            onClick={onPrevMonth}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="px-3 py-1.5 min-w-[140px] text-center font-bold text-sm sm:text-base text-slate-900 dark:text-white font-mono tracking-tight flex items-center justify-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{currentMonthYearText}</span>
          </div>

          <button
            type="button"
            onClick={onNextMonth}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next Month"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onGoToday}
          className="px-3 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-300 dark:bg-indigo-600/30 dark:hover:bg-indigo-600/50 dark:border-indigo-500/40 dark:text-indigo-300 dark:hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          title="Jump to Today's Month & Day"
        >
          Today
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative flex-1 sm:w-48 min-w-[150px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search goals..."
            className="w-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
          {(['ALL', 'Morning', 'Afternoon', 'Evening', 'Night'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => onPeriodChange(period)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/60'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value as any)}
          className="bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="completed">🟢 Completed Only</option>
          <option value="partial">🟡 Partial Only</option>
          <option value="missed">🔴 Missed Only</option>
          <option value="none">⚪ Unselected Only</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
            title="Clear all search and filters"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};
