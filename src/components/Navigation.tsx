import React from 'react';
import { LayoutDashboard, CalendarDays, Trophy, Settings, PlusCircle } from 'lucide-react';

export type ActivePage = 'today' | 'timetable';

interface NavigationProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  onOpenLeaderboard: () => void;
  onManageSchedule: () => void;
  onAddGoal: () => void;
  totalSlots: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onPageChange,
  onOpenLeaderboard,
  onManageSchedule,
  onAddGoal,
  totalSlots,
}) => {
  return (
    <>
      {/* ========================================================================= */}
      {/* 📱 MOBILE FIXED BOTTOM NAVIGATION BAR (Visible on screens < md)          */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] px-3 py-1.5 pb-safe"
      >
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          {/* Tab 1: Today & Overview */}
          <button
            type="button"
            onClick={() => {
              onPageChange('today');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              activePage === 'today'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs scale-[1.02]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="relative">
              <LayoutDashboard className={`w-5 h-5 ${activePage === 'today' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {activePage === 'today' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Today & Stats</span>
          </button>

          {/* Tab 2: Timetable Grid */}
          <button
            type="button"
            onClick={() => {
              onPageChange('timetable');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              activePage === 'timetable'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs scale-[1.02]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="relative">
              <CalendarDays className={`w-5 h-5 ${activePage === 'timetable' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {activePage === 'timetable' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Timetable Grid</span>
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP TOP SEGMENTED NAV BAR / PAGE SWITCHER (Visible on md+)         */}
      {/* ========================================================================= */}
      <div className="hidden md:flex items-center justify-between p-1.5 bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-xl shadow-xs">
        {/* Main 2-Page Segmented Control */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange('today')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePage === 'today'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Page 1: Today & Overview</span>
          </button>

          <button
            type="button"
            onClick={() => onPageChange('timetable')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePage === 'timetable'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Page 2: Timetable Grid</span>
          </button>
        </div>

        {/* Desktop Quick Tools */}
        <div className="flex items-center gap-2 pr-1">
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold transition-all cursor-pointer hover:scale-105"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Leaderboard</span>
          </button>

          <button
            type="button"
            onClick={onManageSchedule}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Routine ({totalSlots})</span>
          </button>

          <button
            type="button"
            onClick={onAddGoal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer hover:scale-105"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>
    </>
  );
};
