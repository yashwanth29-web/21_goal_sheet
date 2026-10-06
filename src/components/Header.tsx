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
  Bell,
} from 'lucide-react';
import { notificationService } from '../utils/notificationService';

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
    <header className="w-full flex flex-col gap-2.5 pb-2 sm:pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Primary Top Bar */}
      <div className="w-full flex items-center justify-between gap-2">
        {/* Brand Logo & Name (Guaranteed Single Line, No Awkward Wrap) */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none whitespace-nowrap">
                Daily Goal Tracker
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 uppercase tracking-wider">
                Cloud
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Track goals & measure consistency
            </p>
          </div>
        </div>

        {/* Action Tools: Notifications, Theme, Leaderboard (Desktop), Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Leaderboard Pill */}
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="hidden md:flex relative group/lb items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95 animate-pulse-glow overflow-hidden shrink-0"
            title="🔥 Check Live Rankings, Today & Monthly Consistency, and Active Streaks!"
          >
            <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 animate-shimmer-sweep pointer-events-none" />
            <Trophy className="w-3.5 h-3.5 text-amber-100 shrink-0" />
            <span className="text-xs font-black tracking-tight whitespace-nowrap">
              Live Leaderboard
            </span>
            <span className="flex h-1.5 w-1.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-300" />
            </span>
          </button>

          {/* Desktop Quick Tools */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              type="button"
              onClick={onManageSchedule}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3 text-indigo-500" />
              <span>Routine ({totalSlots})</span>
            </button>
            <button
              type="button"
              onClick={onAddGoal}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-transform hover:scale-105 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </div>

          {/* Notifications Toggle */}
          <button
            type="button"
            onClick={async () => {
              const granted = await notificationService.requestPermission();
              if (granted) {
                alert('🔔 Reminders Enabled! You will receive daily goal updates.');
              } else if (Notification.permission === 'denied') {
                alert('⚠️ Notifications blocked in browser settings. Please enable them in your address bar.');
              }
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-xs shadow-xs transition-colors cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 shrink-0"
            title="Daily Goal Reminders & Push Notifications"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-xs shadow-xs transition-colors cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 shrink-0"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
            )}
          </button>

          {/* User Account Avatar & Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
              title="User Account"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-[11px] shadow-xs shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-2 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Cloud Connected</span>
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
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-Only Sleek Leaderboard Banner (Clean, High-Contrast & Eye-Catching) */}
      <div className="md:hidden w-full">
        <button
          type="button"
          onClick={onOpenLeaderboard}
          className="relative group/lb w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 active:scale-[0.99] transition-transform overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer-sweep pointer-events-none" />
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-100 group-hover/lb:rotate-12 transition-transform duration-200" />
            <span className="font-extrabold tracking-tight text-white drop-shadow-xs">
              Live Leaderboard & Rankings
            </span>
          </div>

          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-950/40 border border-white/20 text-[9px] font-black uppercase tracking-wider text-emerald-300 shrink-0">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-300" />
            </span>
            <span>LIVE</span>
          </span>
        </button>
      </div>
    </header>
  );
};
