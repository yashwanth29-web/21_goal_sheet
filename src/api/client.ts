import type { Goal, GoalStatus, User, AuthResponse } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

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

    const data = await res.json().catch(() => ({}));

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
  },
};
