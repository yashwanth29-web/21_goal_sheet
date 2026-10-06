import React, { useState, useEffect } from 'react';
import type { Goal } from '../types';
import { api } from '../api/client';
import {
  X,
  Lock,
  UserPlus,
  CheckCircle2,
  Clock,
  CalendarDays,
  RefreshCw,
} from 'lucide-react';

interface FriendTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    name: string;
    email: string;
    friendshipStatus?: 'SELF' | 'ACCEPTED' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'NONE';
    todayRate?: number;
    monthRate?: number;
    streak?: number;
  } | null;
  onFriendRequestSent?: () => void;
}

export const FriendTrackerModal: React.FC<FriendTrackerModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onFriendRequestSent,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [trackerData, setTrackerData] = useState<any>(null);
  const [requestSending, setRequestSending] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && targetUser) {
      loadTracker();
    } else {
      setTrackerData(null);
      setIsLocked(false);
      setActionMessage(null);
    }
  }, [isOpen, targetUser]);

  const loadTracker = async () => {
    if (!targetUser) return;
    setIsLoading(true);
    setActionMessage(null);
    try {
      const res = await api.friends.getTracker(targetUser.id);
      if (res.isLocked || !res.success) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
        setTrackerData(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load friend tracker:', err);
      setIsLocked(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!targetUser) return;
    setRequestSending(true);
    try {
      const res = await api.friends.sendRequest(targetUser.id);
      if (res.success) {
        setActionMessage(res.message || 'Friend request sent!');
        if (onFriendRequestSent) onFriendRequestSent();
      } else {
        setActionMessage(res.message || 'Failed to send request');
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Error sending request');
    } finally {
      setRequestSending(false);
    }
  };

  if (!isOpen || !targetUser) return null;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayKey = `${year}-${month}-${day}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/20 shrink-0">
              {targetUser.name ? targetUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {targetUser.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{targetUser.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
              <span className="text-xs font-semibold">Checking friend permissions...</span>
            </div>
          ) : isLocked ? (
            /* Locked View (Requires Friend Request) */
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10">
                <Lock className="w-7 h-7" />
              </div>

              <div className="max-w-sm mx-auto space-y-1.5">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Private Daily Goal Tracker
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {targetUser.name}’s daily routine, detailed goal completion, and time slots are private.
                  Send a friend request to unlock and view their progress!
                </p>
              </div>

              {actionMessage && (
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  {actionMessage}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                {targetUser.friendshipStatus === 'PENDING_SENT' ? (
                  <span className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
                    <span>⏳ Friend Request Pending</span>
                  </span>
                ) : targetUser.friendshipStatus === 'PENDING_RECEIVED' ? (
                  <span className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
                    This user sent you a request! Check your Requests tab.
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendRequest}
                    disabled={requestSending}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{requestSending ? 'Sending...' : 'Send Friend Request'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Unlocked View for Accepted Friends */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Connected as Friends</span>
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  Full Tracker Unlocked
                </span>
              </div>

              {/* Routine Checklist Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Scheduled Daily Goals ({trackerData?.goals?.length || 0})</span>
                </h4>

                {(!trackerData?.goals || trackerData.goals.length === 0) ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No active routine goals created by this user yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                    {trackerData.goals.map((g: Goal) => {
                      // Check today's status if recorded
                      const todayRecord = trackerData.dailyStatuses?.find(
                        (s: any) => s.goalId === g.id && s.date === todayKey
                      );
                      const isCompleted = todayRecord?.status === 'COMPLETED';
                      const isPartial = todayRecord?.status === 'PARTIALLY_COMPLETED';
                      const isMissed = todayRecord?.status === 'MISSED';

                      return (
                        <div key={g.id} className="p-3 flex items-center justify-between gap-2.5">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {g.workGoal}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              <span className="font-mono flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {g.time}
                              </span>
                              <span>•</span>
                              <span>{g.period}</span>
                              {g.category && (
                                <>
                                  <span>•</span>
                                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                    {g.category}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isCompleted ? (
                              <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                                ✅ Done
                              </span>
                            ) : isPartial ? (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                🟡 Partial
                              </span>
                            ) : isMissed ? (
                              <span className="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold">
                                🔴 Missed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                                Scheduled
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
