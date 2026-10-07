import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type {
  Goal,
  ScheduleSlot,
  GoalStatus,
  StatusRecordsMap,
  Period,
  MonthStatistics,
  AppTheme,
} from './types';
import { useAuth } from './context/AuthContext';
import { api } from './api/client';
import {
  getDaysInMonth,
  getMonthYearDisplay,
  formatDateKey,
  sortSlotsByTime,
} from './utils/dateUtils';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { notificationService } from './utils/notificationService';
import { getFreshAccountabilityMessage } from './utils/accountabilityTanglishMessages';
import { Header } from './components/Header';
import { Navigation, type ActivePage } from './components/Navigation';
import { Statistics } from './components/Statistics';
import { TodayHighlight } from './components/TodayHighlight';
import { TodayGoalsCard } from './components/TodayGoalsCard';
import { CalendarToolbar } from './components/CalendarToolbar';
import { WorkCalendar } from './components/WorkCalendar';
import { AddEditModal } from './components/AddEditModal';
import { ManageScheduleModal } from './components/ManageScheduleModal';
import { NoteModal } from './components/NoteModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { EmptyState } from './components/EmptyState';
import { CalendarDays, RefreshCw } from 'lucide-react';

export function App() {
  const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activePage, setActivePage] = useState<ActivePage>('today');

  const todayDate = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => formatDateKey(todayDate), [todayDate]);

  // Theme State
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Calendar navigation state
  const [currentYear, setCurrentYear] = useState<number>(() => todayDate.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() => todayDate.getMonth());

  // Goal & Status State (Fetched from PostgreSQL API)
  const [slots, setSlots] = useState<Goal[]>([]);
  const [statusRecords, setStatusRecords] = useState<StatusRecordsMap>({});
  const [cheatDays, setCheatDays] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('goal_tracker_cheat_days');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'ALL' | Period>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | GoalStatus>('ALL');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);
  const [isManageScheduleOpen, setIsManageScheduleOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboardInitialTab, setLeaderboardInitialTab] = useState<'all' | 'friends' | 'requests'>('all');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const prevIncomingIdsRef = useRef<Set<string>>(new Set());

  const [noteModalData, setNoteModalData] = useState<{
    isOpen: boolean;
    slot: ScheduleSlot | null;
    dateKey: string;
    note?: string;
  }>({
    isOpen: false,
    slot: null,
    dateKey: '',
    note: '',
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [notification, setNotification] = useState<{ message: string; type?: 'info' | 'success' } | null>(null);

  const showNotification = useCallback((message: string, type: 'info' | 'success' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  }, []);

  // Poll cloud notifications and friend requests with instant phone/browser alert dispatch
  const pollCloudNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      // 1. Check unread notifications in database
      const notifRes = await api.notifications.get(true);
      if (notifRes.success && Array.isArray(notifRes.data) && notifRes.data.length > 0) {
        const unreadList = notifRes.data;
        const unreadIds = unreadList.map((n: any) => n.id);

        unreadList.forEach((n: any) => {
          showNotification(`${n.title}\n${n.message}`, 'info');
          notificationService.sendNotification(n.title, n.message);
        });

        // Mark as read after alerting
        await api.notifications.markAsRead(unreadIds);
      }

      // 2. Poll incoming friend requests
      const friendsRes = await api.friends.getList();
      if (friendsRes.success && friendsRes.data) {
        const incoming = friendsRes.data.incomingRequests || [];
        setPendingRequestsCount(incoming.length);

        const currentIds = new Set(incoming.map((r: any) => r.requestId));
        const newRequests = incoming.filter((r: any) => !prevIncomingIdsRef.current.has(r.requestId));

        if (newRequests.length > 0) {
          newRequests.forEach((req: any) => {
            const senderName = req.from?.name || 'Someone';
            const title = '📩 Kotta Friend Request!';
            const body = `${senderName} neeku friend request pampadu! Connect avvandi! 🎯`;
            notificationService.sendNotification(title, body);
            showNotification(`📩 ${senderName} sent you a friend request!`, 'info');
          });
        }
        prevIncomingIdsRef.current = currentIds;
      }
    } catch (err) {
      console.warn('Failed to poll cloud notifications:', err);
    }
  }, [isAuthenticated, showNotification]);

  useEffect(() => {
    if (!isAuthenticated) return;
    pollCloudNotifications();
    const interval = setInterval(pollCloudNotifications, 6000);
    return () => clearInterval(interval);
  }, [isAuthenticated, pollCloudNotifications]);



  // Update HTML class & theme
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.className = 'bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-100/70 text-slate-900 min-h-screen antialiased selection:bg-indigo-500 selection:text-white';
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch Goals, Monthly Statuses, and Cheat Days from PostgreSQL via Backend API
  const loadUserData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsDataLoading(true);
    try {
      const monthStr = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
      const [goalsRes, statusesRes, cheatRes] = await Promise.all([
        api.goals.getAll(),
        api.goals.getStatuses(monthStr),
        api.goals.getCheatDays(monthStr),
      ]);

      if (goalsRes.success) {
        setSlots(sortSlotsByTime(goalsRes.goals));
      }
      if (statusesRes.success) {
        let merged = { ...(statusesRes.statuses as StatusRecordsMap) };
        try {
          const raw = localStorage.getItem('cached_status_records');
          if (raw) {
            const localCached = JSON.parse(raw);
            Object.keys(localCached).forEach((k) => {
              if (
                !merged[k] ||
                new Date(localCached[k]?.updatedAt || 0).getTime() >=
                  new Date(merged[k]?.updatedAt || 0).getTime()
              ) {
                merged[k] = localCached[k];
              }
            });
          }
        } catch (_e) {
          // ignore
        }
        setStatusRecords(merged);
      }
      if (cheatRes.success && Array.isArray(cheatRes.cheatDays)) {
        setCheatDays((prev) => {
          const next = new Set(prev);
          cheatRes.cheatDays.forEach((d) => next.add(d));
          localStorage.setItem('goal_tracker_cheat_days', JSON.stringify(Array.from(next)));
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to load user calendar data:', err);
    } finally {
      setIsDataLoading(false);
    }
  }, [isAuthenticated, currentYear, currentMonthIndex]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Real-Time Incoming & Accepted Friend Request Listener & Instant Push Notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const checkFriendRequests = async () => {
      try {
        const res = await api.friends.getList();
        if (isMounted && res.success && res.data) {
          const incoming = res.data.incomingRequests || [];
          const friendsList = res.data.friends || [];
          setPendingRequestsCount(incoming.length);

          // 1. Check for new incoming friend requests
          let seenIncoming: string[] = [];
          try {
            const raw = localStorage.getItem('seen_incoming_friend_reqs');
            if (raw) seenIncoming = JSON.parse(raw);
          } catch (_e) {
            seenIncoming = [];
          }
          const seenIncomingSet = new Set(seenIncoming);

          incoming.forEach((req: any) => {
            if (!seenIncomingSet.has(req.requestId)) {
              seenIncomingSet.add(req.requestId);
              const senderName = req.from?.name || 'A friend';
              notificationService.notifyFriendRequestReceived(senderName);
              setNotification({
                type: 'success',
                message: `🔔 Kotta Friend Request from ${senderName}!`,
              });
            }
          });
          localStorage.setItem('seen_incoming_friend_reqs', JSON.stringify(Array.from(seenIncomingSet)));

          // 2. Check for newly accepted friends (so sender gets notified when request is accepted!)
          let seenAccepted: string[] = [];
          try {
            const raw = localStorage.getItem('seen_accepted_friends');
            if (raw) seenAccepted = JSON.parse(raw);
          } catch (_e) {
            seenAccepted = [];
          }
          const seenAcceptedSet = new Set(seenAccepted);

          const isFirstFriendCheck = !localStorage.getItem('seen_accepted_friends_init');
          if (isFirstFriendCheck) {
            friendsList.forEach((f: any) => seenAcceptedSet.add(f.friendshipId));
            localStorage.setItem('seen_accepted_friends_init', 'true');
            localStorage.setItem('seen_accepted_friends', JSON.stringify(Array.from(seenAcceptedSet)));
          } else {
            friendsList.forEach((f: any) => {
              if (!seenAcceptedSet.has(f.friendshipId)) {
                seenAcceptedSet.add(f.friendshipId);
                const friendName = f.friend?.name || 'Your friend';
                notificationService.notifyFriendRequestAccepted(friendName);
                setNotification({
                  type: 'success',
                  message: `🎉 ${friendName} accepted your friend request!`,
                });
              }
            });
            localStorage.setItem('seen_accepted_friends', JSON.stringify(Array.from(seenAcceptedSet)));
          }
        }
      } catch (_err) {
        // ignore
      }
    };

    checkFriendRequests();
    const interval = setInterval(checkFriendRequests, 6000); // Fast 6s polling for instant alerts
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // Automated Daily Notifications (Per-slot Tanglish reminders, strictly suppressed on Cheat Days)
  useEffect(() => {
    if (!isAuthenticated || slots.length === 0) return;

    const isTodayCheatDay = cheatDays.has(todayKey);
    notificationService.checkAndSendDailyNotifications(todayKey, isTodayCheatDay, slots, statusRecords);

    const interval = setInterval(() => {
      notificationService.checkAndSendDailyNotifications(todayKey, isTodayCheatDay, slots, statusRecords);
    }, 45000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        notificationService.checkAndSendDailyNotifications(todayKey, isTodayCheatDay, slots, statusRecords);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, todayKey, cheatDays, slots, statusRecords]);

  const daysInMonth = useMemo(() => {
    return getDaysInMonth(currentYear, currentMonthIndex, todayDate);
  }, [currentYear, currentMonthIndex, todayDate]);

  const todayDay = useMemo(() => {
    const found = daysInMonth.find((d) => d.isToday);
    if (found) return found;
    return {
      date: todayDate,
      dateKey: todayKey,
      dayOfMonth: todayDate.getDate(),
      dayNameShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][todayDate.getDay()],
      dayNameFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][todayDate.getDay()],
      formattedDisplay: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][todayDate.getMonth()]} ${todayDate.getDate() < 10 ? '0' : ''}${todayDate.getDate()}`,
      monthNameShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][todayDate.getMonth()],
      year: todayDate.getFullYear(),
      isToday: true,
      isPast: false,
      isFuture: false,
      isWeekend: todayDate.getDay() === 0 || todayDate.getDay() === 6,
    };
  }, [daysInMonth, todayDate, todayKey]);

  const filteredSlots = useMemo(() => {
    const list = slots.filter((s) => {
      const slotPeriod = s.period.toUpperCase();
      if (selectedPeriod !== 'ALL' && slotPeriod !== selectedPeriod.toUpperCase()) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const title = (s.workGoal || s.goalTitle || '').toLowerCase();
        const matchTitle = title.includes(q);
        const matchCategory = s.category?.toLowerCase().includes(q);
        const matchDesc = s.description?.toLowerCase().includes(q);
        const matchTime = s.time.toLowerCase().includes(q);
        if (!matchTitle && !matchCategory && !matchDesc && !matchTime) return false;
      }
      return true;
    });
    return sortSlotsByTime(list);
  }, [slots, selectedPeriod, searchQuery]);

  const monthStats: MonthStatistics = useMemo(() => {
    let completed = 0;
    let partial = 0;
    let missed = 0;
    let unselected = 0;

    // Filter out cheat days so they are excluded from the target calculation
    const activeDays = daysInMonth.filter((day) => !cheatDays.has(day.dateKey));
    const totalScheduled = activeDays.length * slots.length;

    activeDays.forEach((day) => {
      slots.forEach((slot) => {
        const key = `${day.dateKey}_${slot.id}`;
        const st = statusRecords[key]?.status || 'none';
        if (st === 'completed') completed++;
        else if (st === 'partial') partial++;
        else if (st === 'missed') missed++;
        else unselected++;
      });
    });

    const tracked = completed + partial + missed;
    const achievementRate = totalScheduled > 0
      ? Math.round(((completed + partial * 0.5) / totalScheduled) * 100)
      : tracked > 0
      ? Math.round(((completed + partial * 0.5) / tracked) * 100)
      : 0;

    return {
      totalGoals: totalScheduled,
      totalDays: daysInMonth.length,
      activeDays: activeDays.length,
      cheatDaysCount: daysInMonth.length - activeDays.length,
      completed,
      partial,
      missed,
      unselected,
      achievementRate,
    };
  }, [daysInMonth, slots, statusRecords, cheatDays]);

  // Handle Goal Status Change with Optimistic UI and PostgreSQL Sync
  const handleStatusChange = useCallback(async (dateKey: string, slotId: string, newStatus: GoalStatus) => {
    const key = `${dateKey}_${slotId}`;
    const previous = statusRecords[key];

    // Optimistic Update & Permanent Local Lock
    const timestamp = new Date().toISOString();
    const updatedRecord = {
      ...(statusRecords[key] || { id: `${dateKey}_${slotId}` }),
      status: newStatus,
      updatedAt: timestamp,
    };

    setStatusRecords((prev) => ({
      ...prev,
      [key]: updatedRecord,
    }));

    try {
      const raw = localStorage.getItem('cached_status_records');
      const cache = raw ? JSON.parse(raw) : {};
      cache[key] = updatedRecord;
      localStorage.setItem('cached_status_records', JSON.stringify(cache));
    } catch (_e) {
      // ignore
    }

    // Server Call
    const res = await api.goals.updateStatus(slotId, dateKey, newStatus, previous?.note);
    if (!res.success) {
      showNotification(res.message || 'Status saved locally. Cloud sync pending.', 'info');
    } else {
      const slotObj = slots.find((s) => s.id === slotId);
      const taskTitle = slotObj?.workGoal || slotObj?.goalTitle || 'Daily Task';
      const myName = user?.name || 'You';

      if (newStatus === 'completed') {
        const notif = getFreshAccountabilityMessage('completed', myName, taskTitle, slotObj?.time || '');
        showNotification(`🔥 ${notif.title}`, 'success');
        if (notificationService.isEnabled()) {
          notificationService.sendNotification(notif.title, notif.body);
        }
      } else if (newStatus === 'missed') {
        const notif = getFreshAccountabilityMessage('missed', myName, taskTitle, slotObj?.time || '');
        showNotification(`🚨 ${notif.title}`, 'info');
        if (notificationService.isEnabled()) {
          notificationService.sendNotification(notif.title, notif.body);
        }
      }
    }
  }, [statusRecords, showNotification, slots, user]);

  const handleMarkAllDayCompleted = useCallback(async (dateKey: string) => {
    const timestamp = new Date().toISOString();
    // Optimistic update & cache lock
    setStatusRecords((prev) => {
      const updated = { ...prev };
      slots.forEach((slot) => {
        const key = `${dateKey}_${slot.id}`;
        const existing = updated[key] || { id: key, status: 'none' };
        updated[key] = {
          ...existing,
          status: 'completed',
          updatedAt: timestamp,
        };
      });

      try {
        const raw = localStorage.getItem('cached_status_records');
        const cache = raw ? JSON.parse(raw) : {};
        slots.forEach((slot) => {
          const key = `${dateKey}_${slot.id}`;
          cache[key] = updated[key];
        });
        localStorage.setItem('cached_status_records', JSON.stringify(cache));
      } catch (_e) {
        // ignore
      }

      return updated;
    });

    const myName = user?.name || 'You';
    const notif = getFreshAccountabilityMessage('streak_sweep', myName, 'All Scheduled Goals', '');
    showNotification(`👑 ${notif.title}`, 'success');
    if (notificationService.isEnabled()) {
      notificationService.sendNotification(notif.title, notif.body);
    }

    // PostgreSQL Batch Sync
    await api.goals.batchStatus(dateKey, 'completed');
  }, [slots, showNotification, user]);


  const handleResetDayStatuses = useCallback(async (dateKey: string) => {
    const timestamp = new Date().toISOString();
    setStatusRecords((prev) => {
      const updated = { ...prev };
      slots.forEach((slot) => {
        const key = `${dateKey}_${slot.id}`;
        const existing = updated[key] || { id: key, status: 'none' };
        updated[key] = {
          ...existing,
          status: 'none',
          updatedAt: timestamp,
        };
      });

      try {
        const raw = localStorage.getItem('cached_status_records');
        const cache = raw ? JSON.parse(raw) : {};
        slots.forEach((slot) => {
          const key = `${dateKey}_${slot.id}`;
          cache[key] = updated[key];
        });
        localStorage.setItem('cached_status_records', JSON.stringify(cache));
      } catch (_e) {
        // ignore
      }

      return updated;
    });
    showNotification(`Reset all goal statuses for ${dateKey}.`, 'info');

    // PostgreSQL Batch Sync
    await api.goals.batchStatus(dateKey, 'none');
  }, [slots, showNotification]);

  const handleToggleCheatDay = useCallback(async (dateKey: string) => {
    const isCurrentlyCheat = cheatDays.has(dateKey);
    const newCheatState = !isCurrentlyCheat;

    setCheatDays((prev) => {
      const updated = new Set(prev);
      if (newCheatState) {
        updated.add(dateKey);
      } else {
        updated.delete(dateKey);
      }
      localStorage.setItem('goal_tracker_cheat_days', JSON.stringify(Array.from(updated)));
      return updated;
    });

    if (newCheatState) {
      showNotification(`🌴 Marked ${dateKey} as Cheat Day / Holiday (Excluded from target goals)!`, 'info');
    } else {
      showNotification(`☀️ Restored ${dateKey} as Active Goal Day!`, 'success');
    }

    await api.goals.toggleCheatDay(dateKey, newCheatState);
  }, [cheatDays, showNotification]);

  const handleSaveSlot = async (slotData: Omit<ScheduleSlot, 'id' | 'order'> & { id?: string }) => {
    const title = slotData.workGoal || slotData.goalTitle || 'Untitled Goal';
    if (slotData.id) {
      // Edit existing goal
      const res = await api.goals.update(slotData.id, {
        time: slotData.time,
        period: slotData.period,
        workGoal: title,
        category: slotData.category,
        description: slotData.description,
      });

      if (res.success && res.goal) {
        setSlots((prev) =>
          sortSlotsByTime(prev.map((s) => (s.id === res.goal!.id ? res.goal! : s)))
        );
        showNotification(`Updated goal: ${title}`);
      } else {
        showNotification(res.message || 'Failed to update goal', 'info');
      }
    } else {
      // Add new goal
      const res = await api.goals.create({
        time: slotData.time,
        period: slotData.period,
        workGoal: title,
        category: slotData.category,
        description: slotData.description,
      });

      if (res.success && res.goal) {
        setSlots((prev) => sortSlotsByTime([...prev, res.goal!]));
        showNotification(`Added new goal: ${title}`);
      } else {
        showNotification(res.message || 'Failed to add goal', 'info');
      }
    }
    setEditingSlot(null);
  };

  const promptDeleteSlot = (slot: ScheduleSlot) => {
    const title = slot.workGoal || slot.goalTitle;
    setDeleteConfirm({
      isOpen: true,
      title: `Delete "${title}"?`,
      message: `Are you sure you want to delete the "${slot.time} - ${title}" time slot? This will remove this column from your daily calendar database.`,
      confirmLabel: 'Delete Goal Slot',
      onConfirm: async () => {
        const res = await api.goals.delete(slot.id);
        if (res.success) {
          setSlots((prev) => prev.filter((s) => s.id !== slot.id));
          showNotification(`Deleted goal: ${title}`, 'info');
        } else {
          showNotification(res.message || 'Failed to delete goal', 'info');
        }
      },
    });
  };

  const handleReorderSlots = async (newSlots: ScheduleSlot[]) => {
    setSlots(newSlots as Goal[]);
    await api.goals.reorder(newSlots.map((s) => s.id));
  };

  const handleOpenNote = (slot: ScheduleSlot, dateKey: string, currentNote?: string) => {
    setNoteModalData({
      isOpen: true,
      slot,
      dateKey,
      note: currentNote || '',
    });
  };

  const handleSaveNote = async (noteText: string) => {
    if (!noteModalData.slot) return;
    const key = `${noteModalData.dateKey}_${noteModalData.slot.id}`;
    const currentStatus = statusRecords[key]?.status || 'none';

    setStatusRecords((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: currentStatus,
        note: noteText,
        updatedAt: new Date().toISOString(),
      },
    }));

    await api.goals.updateStatus(noteModalData.slot.id, noteModalData.dateKey, currentStatus, noteText);

    if (noteText.startsWith('[PRODUCTIVE]: ')) {
      const cleanHustle = noteText.replace('[PRODUCTIVE]: ', '');
      const myName = user?.name || 'You';
      const notif = getFreshAccountabilityMessage('productive_work', myName, 'Alternate Slot', '', cleanHustle);
      showNotification(`🌿 ${notif.title}`, 'success');
      if (notificationService.isEnabled()) {
        notificationService.sendNotification(notif.title, notif.body);
      }
    } else {
      showNotification('Note saved successfully!');
    }
  };


  const handleDeleteNote = async () => {
    if (!noteModalData.slot) return;
    const key = `${noteModalData.dateKey}_${noteModalData.slot.id}`;
    const currentStatus = statusRecords[key]?.status || 'none';

    setStatusRecords((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        note: undefined,
      },
    }));

    await api.goals.updateStatus(noteModalData.slot.id, noteModalData.dateKey, currentStatus, '');
    showNotification('Note removed.', 'info');
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const handleJumpToDate = useCallback((dateKey: string) => {
    const [yearStr, monthStr] = dateKey.split('-');
    const targetYear = parseInt(yearStr, 10);
    const targetMonth = parseInt(monthStr, 10) - 1;

    if (targetYear !== currentYear || targetMonth !== currentMonthIndex) {
      setCurrentYear(targetYear);
      setCurrentMonthIndex(targetMonth);
    }

    setTimeout(() => {
      const el = document.getElementById(`date-row-${dateKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.remove('animate-row-flash');
        void el.offsetWidth; // trigger reflow
        el.classList.add('animate-row-flash');
      }
    }, 150);
  }, [currentYear, currentMonthIndex]);

  const handleGoToday = () => {
    setCurrentYear(todayDate.getFullYear());
    setCurrentMonthIndex(todayDate.getMonth());
    setTimeout(() => {
      const el = document.getElementById(`date-row-${todayKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.remove('animate-row-flash');
        void el.offsetWidth;
        el.classList.add('animate-row-flash');
      }
    }, 150);
  };

  // 1. If checking auth token on page load: Show sleek loading screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white selection:bg-indigo-500">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 mb-6 animate-pulse">
          <CalendarDays className="w-8 h-8" />
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Authenticating session...</span>
        </div>
      </div>
    );
  }

  // 2. If not authenticated: Show Login or Register Page
  if (!isAuthenticated || !user) {
    return authView === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  // 3. If Authenticated: Render Main User Dashboard & Timetable
  const monthYearDisplay = getMonthYearDisplay(currentYear, currentMonthIndex);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'light bg-slate-100/70 text-slate-900'} flex flex-col pb-16`}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl text-xs font-semibold text-slate-900 dark:text-white animate-in slide-in-from-bottom-5 fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 pt-3 sm:pt-6 pb-24 md:pb-10 space-y-4 sm:space-y-5">
        {/* 1. Header with Authenticated User & Logout */}
        <Header
          user={user}
          onLogout={logout}
          onAddGoal={() => {
            setEditingSlot(null);
            setIsAddEditOpen(true);
          }}
          onManageSchedule={() => setIsManageScheduleOpen(true)}
          onOpenLeaderboard={() => {
            setLeaderboardInitialTab('all');
            setIsLeaderboardOpen(true);
          }}
          onOpenRequests={() => {
            setLeaderboardInitialTab('requests');
            setIsLeaderboardOpen(true);
          }}
          pendingRequestsCount={pendingRequestsCount}
          totalSlots={slots.length}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* 2. Navigation Switcher (Desktop Tabs & Mobile Fixed Bottom Bar) */}
        <Navigation
          activePage={activePage}
          onPageChange={setActivePage}
          onOpenLeaderboard={() => {
            setLeaderboardInitialTab('all');
            setIsLeaderboardOpen(true);
          }}
          onManageSchedule={() => setIsManageScheduleOpen(true)}
          onAddGoal={() => {
            setEditingSlot(null);
            setIsAddEditOpen(true);
          }}
          totalSlots={slots.length}
        />

        {/* ========================================================================= */}
        {/* 🎯 PAGE 1: TODAY & OVERVIEW                                               */}
        {/* ========================================================================= */}
        {activePage === 'today' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* Today's Highlight Bar (Immediate Daily Focus) */}
            <TodayHighlight
              todayDay={todayDay}
              slots={slots}
              statusRecords={statusRecords}
              isCheatDay={cheatDays.has(todayDay.dateKey)}
              onToggleCheatDay={() => handleToggleCheatDay(todayDay.dateKey)}
              onJumpToToday={() => {
                setActivePage('timetable');
                setTimeout(() => handleGoToday(), 100);
              }}
              onMarkAllTodayCompleted={() => handleMarkAllDayCompleted(todayDay.dateKey)}
            />

            {/* Today's 1-Tap Action Checklist for Mobile & Fast Daily Tracking */}
            <TodayGoalsCard
              todayDay={todayDay}
              slots={slots}
              statusRecords={statusRecords}
              isCheatDay={cheatDays.has(todayDay.dateKey)}
              onStatusChange={handleStatusChange}
              onOpenNote={handleOpenNote}
              onEditSlot={(slot) => {
                setEditingSlot(slot);
                setIsAddEditOpen(true);
              }}
              onDeleteSlot={promptDeleteSlot}
              onMarkAllCompleted={() => handleMarkAllDayCompleted(todayDay.dateKey)}
              onAddGoal={() => {
                setEditingSlot(null);
                setIsAddEditOpen(true);
              }}
            />

            {/* Top Statistics Summary (Compact Month Overview) */}
            <Statistics stats={monthStats} monthName={monthYearDisplay} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📅 PAGE 2: TIMETABLE GRID                                                 */}
        {/* ========================================================================= */}
        {activePage === 'timetable' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* Calendar Toolbar (Month navigation & Filters) */}
            <CalendarToolbar
              currentMonthYearText={monthYearDisplay}
              days={daysInMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onGoToday={handleGoToday}
              onSelectDate={handleJumpToDate}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onResetFilters={() => {
                setSearchQuery('');
                setSelectedPeriod('ALL');
                setSelectedStatus('ALL');
              }}
            />

            {/* Main Timetable / Work Calendar */}
            {isDataLoading && slots.length === 0 ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading your timetable from database...</p>
              </div>
            ) : slots.length === 0 ? (
              <EmptyState
                onCreateSchedule={() => {
                  setEditingSlot(null);
                  setIsAddEditOpen(true);
                }}
                onLoadSample={async () => {
                  const starterGoals = [
                    { time: '08:00 AM', period: 'Morning' as Period, workGoal: 'DSA & Coding Practice', category: 'Coding' },
                    { time: '10:00 AM', period: 'Morning' as Period, workGoal: 'Core Engineering Subjects', category: 'Study' },
                    { time: '02:00 PM', period: 'Afternoon' as Period, workGoal: 'Project Development', category: 'Building' },
                    { time: '06:00 PM', period: 'Evening' as Period, workGoal: 'Exercise & Fitness Routine', category: 'Health' },
                  ];
                  for (const g of starterGoals) {
                    await api.goals.create(g);
                  }
                  await loadUserData();
                  showNotification('Created starter daily schedule in your database!');
                }}
              />
            ) : (
              <WorkCalendar
                days={daysInMonth}
                slots={filteredSlots}
                statusRecords={statusRecords}
                cheatDays={cheatDays}
                onToggleCheatDay={handleToggleCheatDay}
                onStatusChange={handleStatusChange}
                onEditSlot={(slot) => {
                  setEditingSlot(slot);
                  setIsAddEditOpen(true);
                }}
                onDeleteSlot={promptDeleteSlot}
                onAddSlot={() => {
                  setEditingSlot(null);
                  setIsAddEditOpen(true);
                }}
                onOpenNote={handleOpenNote}
                onMarkAllDayCompleted={handleMarkAllDayCompleted}
                onResetDayStatuses={handleResetDayStatuses}
                selectedMonthName={monthYearDisplay}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEditModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingSlot(null);
        }}
        onSave={handleSaveSlot}
        initialSlot={editingSlot}
        selectedDateText={todayDay.formattedDisplay}
      />

      <ManageScheduleModal
        isOpen={isManageScheduleOpen}
        onClose={() => setIsManageScheduleOpen(false)}
        slots={slots}
        onAddSlot={() => {
          setEditingSlot(null);
          setIsAddEditOpen(true);
        }}
        onEditSlot={(slot) => {
          setEditingSlot(slot);
          setIsAddEditOpen(true);
        }}
        onDeleteSlot={promptDeleteSlot}
        onReorderSlots={handleReorderSlots}
      />

      <NoteModal
        isOpen={noteModalData.isOpen}
        onClose={() =>
          setNoteModalData({ isOpen: false, slot: null, dateKey: '', note: '' })
        }
        slot={noteModalData.slot}
        dateKey={noteModalData.dateKey}
        initialNote={noteModalData.note}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={deleteConfirm.onConfirm}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        confirmLabel={deleteConfirm.confirmLabel}
      />

      {/* 6. Live Rankings & Achievement Rate Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUserId={user?.id}
        initialTab={leaderboardInitialTab}
      />
    </div>
  );
}

export default App;
