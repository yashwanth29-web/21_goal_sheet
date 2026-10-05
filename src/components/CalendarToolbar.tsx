import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search, X, MapPin } from 'lucide-react';
import type { Period, GoalStatus } from '../types';
import type { CalendarDay } from '../utils/dateUtils';

interface CalendarToolbarProps {
  currentMonthYearText: string;
  days: CalendarDay[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday: () => void;
  onSelectDate: (dateKey: string) => void;
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
  days,
  onPrevMonth,
  onNextMonth,
  onGoToday,
  onSelectDate,
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
    <div className="w-full flex flex-col gap-3 p-3 sm:p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl bg-white/95 dark:bg-slate-900/80">
      {/* Top Row: Month Navigation + Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Month Stepper */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-1 rounded-xl shadow-inner">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-2 sm:px-3 py-1 min-w-[120px] sm:min-w-[140px] text-center font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-mono tracking-tight flex items-center justify-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{currentMonthYearText}</span>
          </div>

          <button
            type="button"
            onClick={onNextMonth}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Date Jump Selector & Today Button */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          {/* Jump to Specific Date Dropdown */}
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 absolute left-2.5 pointer-events-none" />
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onSelectDate(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer transition-colors shadow-sm"
              title="Select a specific date to jump directly to it"
            >
              <option value="" disabled>
                📅 Jump to Date...
              </option>
              {days.map((d) => (
                <option key={d.dateKey} value={d.dateKey}>
                  {d.formattedDisplay} ({d.dayNameShort}) {d.isToday ? '⭐ Today' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Today Button */}
          <button
            type="button"
            onClick={onGoToday}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            title="Jump to Today"
          >
            Today
          </button>
        </div>
      </div>

      {/* Bottom Row: Search, Period Filter, Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[140px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search goals..."
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl pl-8 pr-7 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

        {/* Scrollable Period Tabs on Mobile */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-xl overflow-x-auto no-scrollbar py-1">
          {(['ALL', 'Morning', 'Afternoon', 'Evening', 'Night'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => onPeriodChange(period)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/60'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full sm:w-auto bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="completed">🟢 Completed</option>
            <option value="partial">🟡 Partial</option>
            <option value="missed">🔴 Missed</option>
            <option value="none">⚪ Unselected</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Clear all filters"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
