import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { LeaderboardUser } from '../types';
import { api } from '../api/client';
import { FriendTrackerModal } from './FriendTrackerModal';
import {
  Trophy,
  X,
  Flame,
  Search,
  RefreshCw,
  Sparkles,
  Users,
  UserPlus,
  Check,
  CheckCircle2,
  Mail,
  Clock,
} from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  initialTab?: ViewTab;
}

type SortField = 'monthly' | 'today' | 'streak';
export type ViewTab = 'all' | 'friends' | 'requests';

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  initialTab = 'friends',
}) => {
  const [activeTab, setActiveTab] = useState<ViewTab>(initialTab);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('monthly');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [selectedFriendForTracker, setSelectedFriendForTracker] = useState<any | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const currentUserCardRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [lbRes, friendsRes] = await Promise.all([
        api.leaderboard.get(),
        api.friends.getList(),
      ]);

      if (lbRes.success && lbRes.data) {
        setUsers(lbRes.data);
        setLastRefreshed(new Date());
      } else if (!lbRes.success) {
        setErrorMessage(lbRes.message || 'Failed to connect to live rankings server.');
      }

      if (friendsRes.success && friendsRes.data) {
        setIncomingRequests(friendsRes.data.incomingRequests || []);
      }
    } catch (err: any) {
      console.error('Failed to load leaderboard:', err);
      setErrorMessage(err.message || 'Failed to load leaderboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSendFriendRequest = async (targetUserId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoadingId(targetUserId);
    try {
      const res = await api.friends.sendRequest(targetUserId);
      if (res.success) {
        // Update local status to PENDING_SENT
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUserId ? { ...u, friendshipStatus: 'PENDING_SENT' } : u))
        );
      } else {
        alert(res.message || 'Failed to send friend request');
      }
    } catch (err: any) {
      alert(err.message || 'Error sending friend request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRespondRequest = async (requestId: string, action: 'ACCEPT' | 'REJECT', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActionLoadingId(requestId);
    try {
      const res = await api.friends.respond(requestId, action);
      if (res.success) {
        await fetchData();
      } else {
        alert(res.message || 'Failed to respond to request');
      }
    } catch (err: any) {
      alert(err.message || 'Error responding to request');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter users based on active tab and search
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (activeTab === 'friends') {
      result = result.filter((u) => u.friendshipStatus === 'ACCEPTED' || u.isCurrentUser || u.id === currentUserId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    if (activeTab === 'friends') {
      // Competitive ranking sort exclusively among friends & self
      result.sort((a, b) => {
        if (sortBy === 'monthly') {
          if (b.monthly.rate !== a.monthly.rate) return b.monthly.rate - a.monthly.rate;
          if (b.today.rate !== a.today.rate) return b.today.rate - a.today.rate;
          return b.streak.current - a.streak.current;
        }
        if (sortBy === 'today') {
          if (b.today.rate !== a.today.rate) return b.today.rate - a.today.rate;
          if (b.monthly.rate !== a.monthly.rate) return b.monthly.rate - a.monthly.rate;
          return b.streak.current - a.streak.current;
        }
        if (sortBy === 'streak') {
          if (b.streak.current !== a.streak.current) return b.streak.current - a.streak.current;
          if (b.monthly.rate !== a.monthly.rate) return b.monthly.rate - a.monthly.rate;
          return b.today.rate - a.today.rate;
        }
        return 0;
      });
    }

    return result;
  }, [users, activeTab, searchQuery, sortBy, currentUserId]);

  const handleScrollToMe = () => {
    if (currentUserCardRef.current) {
      currentUserCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentUserCardRef.current.classList.remove('animate-pulse');
      void currentUserCardRef.current.offsetWidth;
      currentUserCardRef.current.classList.add('animate-pulse');
    }
  };

  const getAvatarColor = (name: string, index: number) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
      'from-violet-500 to-fuchsia-600',
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[(sum + index) % colors.length];
  };

  const acceptedFriendsOnly = users.filter((u) => u.friendshipStatus === 'ACCEPTED');

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600" />

          {/* Compact Clean Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                      Friends Leaderboard
                    </h2>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Compete on daily consistency & streaks with your accepted friends
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={fetchData}
                  disabled={isLoading}
                  title="Refresh rankings"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* View Tabs: Friends (First) | Find Members (Second) | Requests (Third) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('friends')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'friends'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Friends Rankings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Find Members</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
                  activeTab === 'requests'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Requests</span>
                {incomingRequests.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9.5px] font-black animate-pulse">
                    {incomingRequests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Search Box & Sorters (Shown on 'all' and 'friends' tabs) */}
            {activeTab !== 'requests' && (
              <>
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search member by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sorter Row */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSortBy('monthly')}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                      sortBy === 'monthly'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>🏆</span>
                    <span>Monthly</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSortBy('today')}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                      sortBy === 'today'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>⚡</span>
                    <span>Today</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSortBy('streak')}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                      sortBy === 'streak'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>🔥</span>
                    <span>Streak</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleScrollToMe}
                    title="Locate my card"
                    className="py-1.5 px-1 rounded-xl text-[11px] font-bold bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>My Rank</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Body Content */}
          <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2.5">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                <span className="text-xs font-semibold">Loading live rankings & friends...</span>
              </div>
            ) : errorMessage ? (
              <div className="py-10 px-4 text-center space-y-3">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{errorMessage}</p>
                <button
                  type="button"
                  onClick={fetchData}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : activeTab === 'requests' ? (
              /* Incoming Friend Requests Tab */
              incomingRequests.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Mail className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="font-bold">No pending friend requests</p>
                  <p className="text-[11px] mt-0.5">When other users request to connect with you, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.requestId}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {req.from?.name ? req.from.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {req.from?.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{req.from?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleRespondRequest(req.requestId, 'ACCEPT', e)}
                          disabled={actionLoadingId === req.requestId}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleRespondRequest(req.requestId, 'REJECT', e)}
                          disabled={actionLoadingId === req.requestId}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-700 dark:hover:bg-rose-950/40 dark:text-slate-300 dark:hover:text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                {activeTab === 'friends'
                  ? 'No connected friends yet. Send friend requests from All Rankings to view friends here!'
                  : searchQuery
                  ? `No participants found matching "${searchQuery}".`
                  : 'No participants found yet.'}
              </div>
            ) : (
              <>
                {/* In Friends Tab: If no friends yet, show friendly guidance banner */}
                {activeTab === 'friends' && acceptedFriendsOnly.length === 0 && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Compete with your friends!
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Add members to build your private competitive circle & compare streaks.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Find Members</span>
                </button>
              </div>
            )}

            {/* List of Users */}
            {filteredUsers.map((u, idx) => {
              const rankNumber = idx + 1;
              const isMe = u.isCurrentUser || u.id === currentUserId;
              const isFriend = u.friendshipStatus === 'ACCEPTED';
              const isPendingSent = u.friendshipStatus === 'PENDING_SENT';
              const isPendingReceived = u.friendshipStatus === 'PENDING_RECEIVED';

              // TAB 1: FRIENDS RANKINGS (Competitive Ranking between friends & self)
              if (activeTab === 'friends') {
                return (
                  <div
                    key={u.id}
                    ref={isMe ? currentUserCardRef : undefined}
                    onClick={() => {
                      if (!isMe) {
                        setSelectedFriendForTracker(u);
                      }
                    }}
                    className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isMe
                        ? 'bg-gradient-to-r from-indigo-50/90 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/30 border-indigo-400 dark:border-indigo-500 shadow-md shadow-indigo-500/10'
                        : rankNumber === 1
                        ? 'bg-gradient-to-r from-amber-50/70 to-orange-50/50 dark:from-amber-950/20 dark:to-slate-850 border-amber-300 dark:border-amber-500/40 hover:border-amber-400'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                    }`}
                  >
                    {/* Top Row: Rank Medal, Avatar, Name, Badges & Flame Streak */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Rank Badge */}
                        <div className="shrink-0 flex items-center justify-center w-7 h-7">
                          {rankNumber === 1 ? (
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                              🥇
                            </div>
                          ) : rankNumber === 2 ? (
                            <div className="w-7 h-7 rounded-xl bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-black text-xs flex items-center justify-center">
                              🥈
                            </div>
                          ) : rankNumber === 3 ? (
                            <div className="w-7 h-7 rounded-xl bg-amber-700/30 text-amber-800 dark:text-amber-400 font-black text-xs flex items-center justify-center">
                              🥉
                            </div>
                          ) : (
                            <span className="font-mono font-bold text-slate-400 text-xs">#{rankNumber}</span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                            u.name,
                            idx
                          )} flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0`}
                        >
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>

                        {/* Name & Badges */}
                        <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                          <p className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {u.name}
                          </p>

                          {isMe ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-indigo-600 text-white shrink-0 tracking-wider">
                              YOU
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Friend</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Action: Streak Flame Badge */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100/80 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 font-extrabold text-xs font-mono shrink-0 shadow-sm">
                          <Flame className={`w-3.5 h-3.5 ${u.streak.current > 0 ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                          <span>{u.streak.current}d</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Stats: Today Achievement & Monthly Achievement */}
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/50">
                      {/* Today Rate Column */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Today
                          </span>
                          <span
                            className={`font-mono font-extrabold ${
                              u.today.rate >= 80
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : u.today.rate > 0
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {u.today.rate}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${u.today.rate}%` }}
                          />
                        </div>

                        <span className="text-[10px] text-slate-400 font-medium">
                          {`${u.today.completed}/${u.today.total || u.today.tracked || 0} done`}
                        </span>
                      </div>

                      {/* Monthly Rate Column */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Monthly
                          </span>
                          <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                            {u.monthly.rate}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${u.monthly.rate}%` }}
                          />
                        </div>

                        <span className="text-[10px] text-slate-400 font-medium">
                          {`${u.monthly.completed} completed`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              // TAB 2: FIND MEMBERS (Discovery list to send requests; scores are private until accepted!)
              return (
                <div
                  key={u.id}
                  className="p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Member Avatar */}
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                        u.name,
                        idx
                      )} flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0`}
                    >
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    {/* Member Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {u.name}
                        </p>
                        {isMe && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-indigo-600 text-white shrink-0">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  {/* Add / Status Action Button */}
                  <div className="shrink-0">
                    {isMe ? (
                      <span className="text-xs text-slate-400 font-medium italic">Your Profile</span>
                    ) : isFriend ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Connected</span>
                      </span>
                    ) : isPendingSent ? (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Requested</span>
                      </span>
                    ) : isPendingReceived ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          if (u.friendshipRequestId) {
                            handleRespondRequest(u.friendshipRequestId, 'ACCEPT', e);
                          }
                        }}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Accept</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleSendFriendRequest(u.id, e)}
                        disabled={actionLoadingId === u.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                        title="Send friend request to compete on daily routine scores"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add Friend</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

          {/* Compact Footer */}
          <div className="p-3 sm:p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between text-xs shrink-0">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Updated {lastRefreshed.toLocaleTimeString()}</span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold transition-all cursor-pointer text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Friend Tracker Modal */}
      {selectedFriendForTracker && (
        <FriendTrackerModal
          isOpen={Boolean(selectedFriendForTracker)}
          onClose={() => setSelectedFriendForTracker(null)}
          targetUser={selectedFriendForTracker}
          onFriendRequestSent={fetchData}
        />
      )}
    </>
  );
};
