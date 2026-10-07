import React, { useState, useRef, useEffect } from 'react';
import type { AppTheme, User } from '../types';
import {
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
  onOpenRequests?: () => void;
  pendingRequestsCount?: number;
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
  onOpenRequests,
  pendingRequestsCount = 0,
  totalSlots,
  theme,
  onToggleTheme,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [headerModal, setHeaderModal] = useState<{
    title: string;
    message: string;
    type?: 'info' | 'success' | 'confirm';
    onConfirm?: () => void;
    confirmLabel?: string;
  } | null>(null);
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
          <img
            src="/icon-192.png"
            alt="Daily Work Tracker"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-md shadow-indigo-600/20 shrink-0 object-contain bg-white"
          />

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
            className="hidden md:flex relative group/lb items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95 animate-pulse-glow overflow-hidden shrink-0"
            title="🔥 Check Live Rankings & Friends"
          >
            <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 animate-shimmer-sweep pointer-events-none" />
            <Trophy className="w-4 h-4 text-amber-100 shrink-0" />
            <span className="text-xs font-black tracking-tight whitespace-nowrap">
              Leaderboard
            </span>
            {pendingRequestsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shrink-0 animate-bounce">
                +{pendingRequestsCount}
              </span>
            ) : (
              <span className="flex h-1.5 w-1.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-300" />
              </span>
            )}
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
              if (pendingRequestsCount > 0 && onOpenRequests) {
                onOpenRequests();
                return;
              }
              const granted = await notificationService.requestPermission();
              if (granted) {
                setHeaderModal({
                  title: '🔔 Reminders Enabled',
                  message: 'You will receive daily goal reminders, slot notifications, and friend request alerts.',
                  type: 'success',
                });
              } else if (Notification.permission === 'denied') {
                setHeaderModal({
                  title: '⚠️ Notifications Blocked',
                  message: 'Notifications are blocked in your browser settings. Please allow notifications in your address bar or site settings.',
                  type: 'info',
                });
              }
            }}
            className="relative p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-xs shadow-xs transition-colors cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 shrink-0"
            title={pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending Friend Requests!` : 'Daily Goal Reminders & Push Notifications'}
          >
            <Bell className={`w-3.5 h-3.5 ${pendingRequestsCount > 0 ? 'text-rose-500 animate-wiggle' : 'text-amber-500'}`} />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-black shadow-xs">
                {pendingRequestsCount}
              </span>
            )}
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
                      setHeaderModal({
                        title: 'Log Out',
                        message: 'Are you sure you want to log out of your account?',
                        type: 'confirm',
                        confirmLabel: 'Log Out',
                        onConfirm: onLogout,
                      });
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

      {/* Clean & Simple In-App Modal Dialog */}
      {headerModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-5 space-y-3.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base shrink-0">
                  {headerModal.type === 'confirm' ? '🚪' : headerModal.type === 'success' ? '🔔' : 'ℹ️'}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {headerModal.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setHeaderModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {headerModal.message}
            </p>

            <div className="flex justify-end gap-2 pt-1">
              {headerModal.type === 'confirm' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setHeaderModal(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      headerModal.onConfirm?.();
                      setHeaderModal(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {headerModal.confirmLabel || 'Confirm'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setHeaderModal(null)}
                  className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer text-center"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile-Only Sleek Leaderboard Banner (Clean & High-Contrast) */}
      <div className="md:hidden w-full">
        <button
          type="button"
          onClick={onOpenLeaderboard}
          className="relative group/lb w-full flex items-center justify-between px-4 py-2.5 sm:py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-[0.99] transition-transform overflow-hidden cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-100 shrink-0" />
            <span className="font-extrabold tracking-tight text-white">
              Friends Leaderboard
            </span>
          </div>

          {pendingRequestsCount > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shrink-0 animate-pulse">
              +{pendingRequestsCount} Requests
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-600/60 border border-white/20 text-[9.5px] font-black uppercase tracking-wider text-white shrink-0">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-300" />
              </span>
              <span>LIVE</span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
