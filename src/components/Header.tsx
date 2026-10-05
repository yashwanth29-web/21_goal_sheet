import React, { useState, useRef, useEffect } from 'react';
import type { AppTheme, User } from '../types';
import {
  CalendarDays,
  Plus,
  SlidersHorizontal,
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  Trophy,
} from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onAddGoal: () => void;
  onManageSchedule: () => void;
  onOpenLeaderboard: () => void;
  totalSlots: number;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onAddGoal,
  onManageSchedule,
  onOpenLeaderboard,
  totalSlots,
  theme,
  onToggleTheme,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
          <CalendarDays className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Daily Goal Tracker
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 uppercase tracking-wider">
              Cloud Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
            Track your daily goals and measure consistency
          </p>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-start md:justify-end">
        {/* User Account Pill & Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
            title="User Account"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="truncate max-w-[120px]">{user.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute left-0 sm:left-auto right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-2 text-xs animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Authenticated via JWT</span>
                </div>
              </div>

              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (window.confirm('Are you sure you want to log out?')) {
                      onLogout();
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
          title={`Switch to ${theme === 'dark' ? 'Light (White)' : 'Dark (Black)'} Theme`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Live Rankings / Leaderboard Button */}
        <button
          type="button"
          onClick={onOpenLeaderboard}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 dark:from-amber-500/20 dark:via-amber-500/30 dark:to-orange-500/20 border border-amber-300/80 dark:border-amber-500/50 text-amber-900 dark:text-amber-300 text-xs font-extrabold shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          title="View Live User Rankings, Today & Monthly Achievement Rates, and Streaks"
        >
          <div className="relative flex items-center">
            <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <span>Live Rankings</span>
        </button>

        {/* Manage Routine Button */}
        <button
          type="button"
          onClick={onManageSchedule}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
          title="Manage timetable time slots"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Manage Routine ({totalSlots})</span>
        </button>

        {/* Add Goal Button */}
        <button
          type="button"
          onClick={onAddGoal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Goal</span>
        </button>
      </div>
    </header>
  );
};
