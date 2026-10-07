import type { Goal, GoalStatus, User, AuthResponse, LeaderboardResponse } from '../types';

function getApiBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (!clean.endsWith('/api') && !clean.includes('/api/')) {
      clean = `${clean}/api`;
    }
    return clean;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '/api';
  }
  return 'http://localhost:5000/api';
}

const API_BASE = getApiBaseUrl();

const TOKEN_KEY = 'goal_tracker_jwt_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.error('Error setting token in localStorage:', err);
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!isJson) {
      // The server returned HTML (likely Vercel routing to index.html due to missing API route/VITE_API_URL)
      const text = await res.text().catch(() => '');
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        return {
          success: false,
          message:
            'Backend API route not reached (received HTML page). If deployed on Vercel, please ensure VITE_API_URL is configured in your project settings to point to your backend API URL.',
        };
      }
    }

    const data = isJson ? await res.json().catch(() => ({})) : {};

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    return {
      success: false,
      message: err.message || 'Cannot connect to backend server. Make sure the API is running.',
    };
  }
}

export const api = {
  // Auth API
  auth: {
    async register(name: string, email: string, password: string): Promise<AuthResponse> {
      const res = await request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      if (res.success && res.data?.token) {
        setStoredToken(res.data.token);
      }
      return {
        success: res.success,
        message: res.data?.message || res.message,
        token: res.data?.token,
        user: res.data?.user,
      };
    },

    async login(email: string, password: string): Promise<AuthResponse> {
      const res = await request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.success && res.data?.token) {
        setStoredToken(res.data.token);
      }
      return {
        success: res.success,
        message: res.data?.message || res.message,
        token: res.data?.token,
        user: res.data?.user,
      };
    },

    async getMe(): Promise<{ success: boolean; user?: User; message?: string }> {
      const res = await request<{ user: User }>('/auth/me', {
        method: 'GET',
      });
      return {
        success: res.success,
        user: res.data?.user,
        message: res.message,
      };
    },

    logout(): void {
      setStoredToken(null);
    },
  },

  // Goals & Timetable API
  goals: {
    async getAll(date?: string): Promise<{ success: boolean; goals: Goal[]; message?: string }> {
      const query = date ? `?date=${encodeURIComponent(date)}` : '';
      const res = await request<{ goals: Goal[] }>(`/goals${query}`, {
        method: 'GET',
      });
      return {
        success: res.success,
        goals: res.data?.goals || [],
        message: res.message,
      };
    },

    async create(goalData: Omit<Goal, 'id' | 'order'>): Promise<{ success: boolean; goal?: Goal; message?: string }> {
      const res = await request<{ goal: Goal; message?: string }>('/goals', {
        method: 'POST',
        body: JSON.stringify(goalData),
      });
      return {
        success: res.success,
        goal: res.data?.goal,
        message: res.data?.message || res.message,
      };
    },

    async update(id: string, goalData: Partial<Goal>): Promise<{ success: boolean; goal?: Goal; message?: string }> {
      const res = await request<{ goal: Goal; message?: string }>(`/goals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(goalData),
      });
      return {
        success: res.success,
        goal: res.data?.goal,
        message: res.data?.message || res.message,
      };
    },

    async delete(id: string): Promise<{ success: boolean; message?: string }> {
      const res = await request<{ message: string }>(`/goals/${id}`, {
        method: 'DELETE',
      });
      return {
        success: res.success,
        message: res.data?.message || res.message,
      };
    },

    async reorder(goalIds: string[]): Promise<{ success: boolean; message?: string }> {
      const res = await request<{ message: string }>('/goals/reorder', {
        method: 'PUT',
        body: JSON.stringify({ goalIds }),
      });
      return {
        success: res.success,
        message: res.data?.message || res.message,
      };
    },

    async getStatuses(month?: string): Promise<{
      success: boolean;
      statuses: Record<string, { id: string; status: GoalStatus; note?: string; updatedAt: string }>;
      message?: string;
    }> {
      const query = month ? `?month=${encodeURIComponent(month)}` : '';
      const res = await request<{ statuses: Record<string, any> }>(`/goals/statuses${query}`, {
        method: 'GET',
      });
      return {
        success: res.success,
        statuses: res.data?.statuses || {},
        message: res.message,
      };
    },

    async updateStatus(
      goalId: string,
      date: string,
      status: GoalStatus,
      note?: string
    ): Promise<{ success: boolean; record?: any; message?: string }> {
      const res = await request<{ record: any; message?: string }>(`/goals/${goalId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ date, status, note }),
      });
      return {
        success: res.success,
        record: res.data?.record,
        message: res.data?.message || res.message,
      };
    },

    async batchStatus(date: string, status: GoalStatus): Promise<{ success: boolean; message?: string }> {
      const res = await request<{ message: string }>('/goals/batch-status', {
        method: 'POST',
        body: JSON.stringify({ date, status }),
      });
      return {
        success: res.success,
        message: res.data?.message || res.message,
      };
    },

    async getCheatDays(month?: string): Promise<{ success: boolean; cheatDays: string[]; message?: string }> {
      const query = month ? `?month=${encodeURIComponent(month)}` : '';
      const res = await request<{ cheatDays: string[] }>(`/goals/cheat-days${query}`, {
        method: 'GET',
      });
      return {
        success: res.success,
        cheatDays: res.data?.cheatDays || [],
        message: res.message,
      };
    },

    async toggleCheatDay(
      date: string,
      isCheatDay?: boolean,
      reason?: string
    ): Promise<{ success: boolean; isCheatDay: boolean; message?: string }> {
      const res = await request<{ isCheatDay: boolean; message: string }>('/goals/cheat-days/toggle', {
        method: 'POST',
        body: JSON.stringify({ date, isCheatDay, reason }),
      });
      return {
        success: res.success,
        isCheatDay: res.data?.isCheatDay ?? false,
        message: res.data?.message || res.message,
      };
    },
  },

  // Live Community Leaderboard API
  leaderboard: {
    async get(): Promise<LeaderboardResponse> {
      const res = await request<LeaderboardResponse>('/leaderboard', {
        method: 'GET',
      });
      return {
        success: res.success,
        data: res.data?.data || [],
        todayKey: res.data?.todayKey || '',
        monthKey: res.data?.monthKey || '',
        totalUsers: res.data?.totalUsers || 0,
        message: res.data?.message || res.message,
      };
    },
  },

  // Friends & Privacy Request API
  friends: {
    async sendRequest(receiverId?: string, receiverEmail?: string): Promise<{ success: boolean; message?: string }> {
      const res = await request<{ message: string }>('/friends/request', {
        method: 'POST',
        body: JSON.stringify({ receiverId, receiverEmail }),
      });
      return {
        success: res.success,
        message: res.data?.message || res.message,
      };
    },

    async respond(requestId: string, action: 'ACCEPT' | 'REJECT'): Promise<{ success: boolean; message?: string }> {
      const res = await request<{ message: string }>('/friends/respond', {
        method: 'POST',
        body: JSON.stringify({ requestId, action }),
      });
      return {
        success: res.success,
        message: res.data?.message || res.message,
      };
    },

    async getList(): Promise<{
      success: boolean;
      data?: {
        friends: any[];
        incomingRequests: any[];
        outgoingRequests: any[];
        totalFriends: number;
        pendingIncomingCount: number;
      };
      message?: string;
    }> {
      const res = await request<{
        friends: any[];
        incomingRequests: any[];
        outgoingRequests: any[];
        totalFriends: number;
        pendingIncomingCount: number;
      }>('/friends/list', {
        method: 'GET',
      });
      return {
        success: res.success,
        data: res.data,
        message: res.message,
      };
    },

    async toggleAccountabilityPartner(
      friendshipId?: string,
      targetUserId?: string,
      enable?: boolean
    ): Promise<{ success: boolean; isAccountabilityPartner?: boolean; message?: string }> {
      const res = await request<{ isAccountabilityPartner: boolean; message: string }>('/friends/toggle-partner', {
        method: 'POST',
        body: JSON.stringify({ friendshipId, targetUserId, enable }),
      });
      return {
        success: res.success,
        isAccountabilityPartner: res.data?.isAccountabilityPartner,
        message: res.data?.message || res.message,
      };
    },

    async search(query: string = ''): Promise<{

      success: boolean;
      data?: Array<{
        id: string;
        name: string;
        email: string;
        relationship: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED';
        requestId?: string;
        joinedAt: string;
      }>;
      message?: string;
    }> {
      const q = encodeURIComponent(query);
      const res = await request<Array<{
        id: string;
        name: string;
        email: string;
        relationship: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED';
        requestId?: string;
        joinedAt: string;
      }>>(`/friends/search?q=${q}`, {
        method: 'GET',
      });
      return {
        success: res.success,
        data: res.data,
        message: res.message,
      };
    },

    async getTracker(userId: string, month?: string): Promise<{
      success: boolean;
      isLocked?: boolean;
      data?: any;
      message?: string;
    }> {
      const query = month ? `?month=${encodeURIComponent(month)}` : '';
      const res = await request<any>(`/friends/tracker/${userId}${query}`, {
        method: 'GET',
      });
      return {
        success: res.success,
        isLocked: (res.data as any)?.isLocked,
        data: (res.data as any)?.data,
        message: res.data?.message || res.message,
      };
    },

    async remove(params: { friendshipId?: string; targetUserId?: string }): Promise<{ success: boolean; message?: string }> {
      const res = await request<{ message: string }>('/friends/remove', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      return {
        success: res.success,
        message: res.data?.message || res.message,
      };
    },
  },

  // In-App & Cloud Notifications API
  notifications: {
    async get(unreadOnly: boolean = false): Promise<{
      success: boolean;
      data?: any[];
      unreadCount?: number;
      message?: string;
    }> {
      const q = unreadOnly ? '?unread=true' : '';
      const res = await request<any[]>(`/notifications${q}`, {
        method: 'GET',
      });
      return {
        success: res.success,
        data: res.data,
        unreadCount: (res as any).unreadCount,
        message: res.message,
      };
    },

    async markAsRead(notificationIds?: string[], markAll: boolean = false): Promise<{ success: boolean }> {
      const res = await request<{ message: string }>('/notifications/mark-read', {
        method: 'POST',
        body: JSON.stringify({ notificationIds, markAll }),
      });
      return { success: res.success };
    },
  },
};


