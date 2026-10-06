import React, { useState, useEffect, useMemo } from 'react';
import type { LeaderboardUser } from '../types';
import { api } from '../api/client';
import { FriendTrackerModal } from './FriendTrackerModal';
import {
  Trophy,
  X,
  Flame,
  Search,
  RefreshCw,
  UserPlus,
  Check,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Inbox,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  initialTab?: 'leaderboard' | 'friends';
}

type SortField = 'monthly' | 'today' | 'streak';

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  initialTab = 'leaderboard',
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends'>(initialTab);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Leaderboard filters
  const [sortBy, setSortBy] = useState<SortField>('monthly');
  const [searchFriend, setSearchFriend] = useState('');

  // Discover & Search Friends state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedFriendForTracker, setSelectedFriendForTracker] = useState<any | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Sync initialTab when opening modal
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const fetchLeaderboardAndFriends = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [lbRes, friendsRes] = await Promise.all([
        api.leaderboard.get(),
        api.friends.getList(),
      ]);

      if (lbRes.success && lbRes.data) {
        setUsers(lbRes.data);
      } else if (!lbRes.success) {
        setErrorMessage(lbRes.message || 'Failed to load leaderboard data.');
      }

      if (friendsRes.success && friendsRes.data) {
        setIncomingRequests(friendsRes.data.incomingRequests || []);
      }
    } catch (err: any) {
      console.error('Failed to load leaderboard:', err);
      setErrorMessage(err.message || 'Failed to connect to leaderboard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Perform user search for adding friends
  const executeSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await api.friends.search(query);
      if (res.success && res.data) {
        setSearchResults(res.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboardAndFriends();
      if (activeTab === 'friends') {
        executeSearch(searchQuery);
      }
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (activeTab === 'friends') {
      const timer = setTimeout(() => {
        executeSearch(searchQuery);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, activeTab]);

  const handleSendFriendRequest = async (targetUserId: string) => {
    setActionLoadingId(targetUserId);
    try {
      const res = await api.friends.sendRequest(targetUserId);
      if (res.success) {
        // Update search list state
        setSearchResults((prev) =>
          prev.map((u) => (u.id === targetUserId ? { ...u, relationship: 'PENDING_SENT' } : u))
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

  const handleRespondRequest = async (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    setActionLoadingId(requestId);
    try {
      const res = await api.friends.respond(requestId, action);
      if (res.success) {
        await fetchLeaderboardAndFriends();
        executeSearch(searchQuery);
      } else {
        alert(res.message || 'Failed to respond to request');
      }
    } catch (err: any) {
      alert(err.message || 'Error responding to request');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Sorted and filtered friends leaderboard
  const sortedLeaderboard = useMemo(() => {
    let list = [...users];

    if (searchFriend.trim()) {
      const q = searchFriend.toLowerCase().trim();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
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

    return list;
  }, [users, sortBy, searchFriend]);

  const acceptedFriendsCount = users.filter((u) => !u.isCurrentUser).length;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">
          
          {/* Header Bar */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Leaderboard</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Live
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeTab === 'leaderboard' ? 'Your ranking & connected friends' : 'Connect with friends to view streaks'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={fetchLeaderboardAndFriends}
                disabled={isLoading}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Refresh rankings"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Segmented Top Tabs */}
          <div className="px-5 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center justify-between gap-2">
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('leaderboard')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Friends Leaderboard</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold ml-1">
                  {users.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('friends')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                  activeTab === 'friends'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-500" />
                <span>Find & Add Friends</span>
                {incomingRequests.length > 0 && (
                  <span className="flex h-2 w-2 relative ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                )}
              </button>
            </div>

            {/* Quick Sort Options for Leaderboard tab */}
            {activeTab === 'leaderboard' && (
              <div className="hidden sm:flex items-center gap-1 text-[11px]">
                <span className="text-slate-400 font-medium mr-1">Sort:</span>
                {(['monthly', 'today', 'streak'] as SortField[]).map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => setSortBy(field)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      sortBy === field
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {field === 'monthly' ? 'Monthly %' : field === 'today' ? 'Today %' : 'Streak'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: FRIENDS LEADERBOARD */}
            {activeTab === 'leaderboard' && (
              <>
                {/* Mobile Sort Pills */}
                <div className="sm:hidden flex items-center justify-between gap-1 pb-1">
                  <span className="text-[11px] text-slate-400 font-medium">Rank by:</span>
                  <div className="flex items-center gap-1">
                    {(['monthly', 'today', 'streak'] as SortField[]).map((field) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() => setSortBy(field)}
                        className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                          sortBy === field
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {field === 'monthly' ? 'Monthly' : field === 'today' ? 'Today' : 'Streak'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search in friends */}
                {users.length > 4 && (
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchFriend}
                      onChange={(e) => setSearchFriend(e.target.value)}
                      placeholder="Filter ranking..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* Empty State / Only Self */}
                {acceptedFriendsCount === 0 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/50 dark:border-indigo-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Track goals alongside your friends!
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Add friends to compare streaks, monthly consistency, and view each other's schedules.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('friends')}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Find Friends</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Users List */}
                <div className="space-y-2.5">
                  {sortedLeaderboard.map((user, idx) => {
                    const rank = idx + 1;
                    const isSelf = user.isCurrentUser || user.id === currentUserId;

                    return (
                      <div
                        key={user.id}
                        className={`group relative p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isSelf
                            ? 'bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Left: Rank & User Profile */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Rank Badge */}
                          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                            {rank === 1 ? (
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
                                🥇
                              </div>
                            ) : rank === 2 ? (
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs">
                                🥈
                              </div>
                            ) : rank === 3 ? (
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-700/80 text-amber-100 font-black text-xs flex items-center justify-center shadow-xs">
                                🥉
                              </div>
                            ) : (
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center">
                                #{rank}
                              </div>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>

                          {/* Name & Subtitle */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                {user.name}
                              </span>
                              {isSelf ? (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-indigo-600 text-white uppercase tracking-wider">
                                  You
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                                  <UserCheck className="w-2.5 h-2.5 text-emerald-500" />
                                  <span>Friend</span>
                                </span>
                              )}
                            </div>

                            {/* Micro stats details */}
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                              <span>
                                Today: <strong className="text-slate-800 dark:text-slate-200">{user.today.rate}%</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Monthly: <strong className="text-slate-800 dark:text-slate-200">{user.monthly.rate}%</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Primary Metric & Tracker Action */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          {/* Streak Pill */}
                          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-bold">
                            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{user.streak.current}d</span>
                          </div>

                          {/* Primary Score Pill */}
                          <div className="text-right">
                            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                              {sortBy === 'streak'
                                ? `${user.streak.current} Days`
                                : sortBy === 'today'
                                ? `${user.today.rate}%`
                                : `${user.monthly.rate}%`}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                              {sortBy === 'streak' ? 'Streak' : sortBy === 'today' ? 'Today' : 'Monthly'}
                            </div>
                          </div>

                          {/* Tracker Detail View Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedFriendForTracker(user)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                            title="View full routine & daily breakdown"
                          >
                            <span>Tracker</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* TAB 2: FIND & ADD FRIENDS */}
            {activeTab === 'friends' && (
              <div className="space-y-4">
                {/* Incoming Requests Section (If Any) */}
                {incomingRequests.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">
                          Incoming Friend Requests ({incomingRequests.length})
                        </h4>
                      </div>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                        Respond to unlock rankings
                      </span>
                    </div>

                    <div className="space-y-2">
                      {incomingRequests.map((req) => (
                        <div
                          key={req.requestId}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between gap-2 shadow-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {req.from.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {req.from.name}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {req.from.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleRespondRequest(req.requestId, 'ACCEPT')}
                              disabled={actionLoadingId === req.requestId}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRespondRequest(req.requestId, 'REJECT')}
                              disabled={actionLoadingId === req.requestId}
                              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Bar */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Search People to Connect
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type name or email to search..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {isSearching && (
                      <RefreshCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 animate-spin" />
                    )}
                  </div>
                </div>

                {/* Search Results / Discover List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                    <span>{searchQuery.trim() ? 'Matching Members' : 'Suggested Members on Platform'}</span>
                    <span>{searchResults.length} found</span>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      {isSearching ? 'Searching users...' : 'No other users found matching your search.'}
                    </div>
                  ) : (
                    searchResults.map((user) => {
                      const isSelf = user.id === currentUserId;
                      if (isSelf) return null;

                      return (
                        <div
                          key={user.id}
                          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {user.name}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {user.relationship === 'ACCEPTED' ? (
                              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Connected</span>
                              </span>
                            ) : user.relationship === 'PENDING_SENT' ? (
                              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-500" />
                                <span>Requested</span>
                              </span>
                            ) : user.relationship === 'PENDING_RECEIVED' ? (
                              <button
                                type="button"
                                onClick={() => handleRespondRequest(user.requestId!, 'ACCEPT')}
                                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Accept</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSendFriendRequest(user.id)}
                                disabled={actionLoadingId === user.id}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>Add Friend</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Private & secure: only accepted friends share progress</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Friend Detailed Tracker Breakdown Modal */}
      {selectedFriendForTracker && (
        <FriendTrackerModal
          isOpen={Boolean(selectedFriendForTracker)}
          onClose={() => setSelectedFriendForTracker(null)}
          targetUser={{
            id: selectedFriendForTracker.id,
            name: selectedFriendForTracker.name,
            email: selectedFriendForTracker.email,
            friendshipStatus: selectedFriendForTracker.friendshipStatus,
            todayRate: selectedFriendForTracker.today?.rate,
            monthRate: selectedFriendForTracker.monthly?.rate,
            streak: selectedFriendForTracker.streak?.current,
          }}
        />
      )}
    </>
  );
};
