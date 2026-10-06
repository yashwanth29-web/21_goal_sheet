export type Period = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' | 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type GoalStatus = 'none' | 'completed' | 'partial' | 'missed';

export type AppTheme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  pin?: string;
  createdAt: string;
  lastActiveAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface Goal {
  id: string;
  userId?: string;
  time: string; // e.g., "08:00 AM"
  period: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' | 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  workGoal: string; // e.g., "DSA Practice"
  goalTitle?: string; // alias for timetable components
  category?: string; // e.g., "Study", "Work", "Fitness", "Personal"
  description?: string; // Optional detailed description
  date?: string | null; // null for routine or YYYY-MM-DD
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// ScheduleSlot is an alias of Goal for flexible timetable rendering
export type ScheduleSlot = Goal;

export interface CellStatusRecord {
  id?: string;
  status: GoalStatus;
  note?: string;
  updatedAt?: string;
}

// Key is `YYYY-MM-DD_goalId`
export type StatusRecordsMap = Record<string, CellStatusRecord>;

export interface MonthStatistics {
  totalGoals: number;
  totalDays: number;
  activeDays: number;
  cheatDaysCount: number;
  completed: number;
  partial: number;
  missed: number;
  unselected: number;
  achievementRate: number; // percentage (0-100)
}

export interface CheatDayRecord {
  date: string;
  reason?: string;
}

export interface AppFilterState {
  searchQuery: string;
  periodFilter: 'ALL' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  statusFilter: 'ALL' | GoalStatus;
}

export type FriendshipStatus = 'SELF' | 'ACCEPTED' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'NONE';

export interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  isCurrentUser: boolean;
  friendshipStatus?: FriendshipStatus;
  friendshipRequestId?: string;
  totalGoals: number;
  today: {
    rate: number;
    completed: number;
    partial: number;
    missed: number;
    tracked: number;
    total: number;
  };
  monthly: {
    rate: number;
    completed: number;
    partial: number;
    missed: number;
    tracked: number;
  };
  streak: {
    current: number;
    best: number;
    isActiveToday: boolean;
  };
  allTimeCompleted: number;
  lastActiveAt: string;
  joinedAt: string;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardUser[];
  todayKey: string;
  monthKey: string;
  totalUsers: number;
  message?: string;
}

export interface FriendItem {
  friendshipId: string;
  friend: {
    id: string;
    name: string;
    email: string;
  };
  connectedAt: string;
}

export interface IncomingRequestItem {
  requestId: string;
  from: {
    id: string;
    name: string;
    email: string;
  };
  requestedAt: string;
}

export interface OutgoingRequestItem {
  requestId: string;
  to: {
    id: string;
    name: string;
    email: string;
  };
  requestedAt: string;
}

export interface FriendsAndRequestsResponse {
  success: boolean;
  data: {
    friends: FriendItem[];
    incomingRequests: IncomingRequestItem[];
    outgoingRequests: OutgoingRequestItem[];
    totalFriends: number;
    pendingIncomingCount: number;
  };
  message?: string;
}

export interface FriendDetailedTrackerResponse {
  success: boolean;
  isLocked: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      createdAt: string;
    };
    goals: Goal[];
    dailyStatuses: Array<{
      id: string;
      goalId: string;
      date: string;
      status: string;
      note?: string;
    }>;
    cheatDays: Array<{
      date: string;
      reason?: string;
    }>;
  };
}

