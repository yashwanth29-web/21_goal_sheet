import type { ScheduleSlot, StatusRecordsMap, AppTheme, UserProfile } from '../types';
import { INITIAL_SCHEDULE_SLOTS, generateInitialStatusRecords } from './sampleData';

const STORAGE_KEYS = {
  PROFILES_LIST: 'goal_tracker_profiles_list_v2',
  ACTIVE_PROFILE_ID: 'goal_tracker_active_profile_id_v2',
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_main',
  name: 'My Workspace',
  avatarColor: '#6366f1', // Indigo
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
};

// Profile Helpers
export function loadProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES_LIST);
    if (!raw) {
      saveProfiles([DEFAULT_PROFILE]);
      return [DEFAULT_PROFILE];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [DEFAULT_PROFILE];
  } catch (err) {
    console.error('Error loading profiles:', err);
    return [DEFAULT_PROFILE];
  }
}

export function saveProfiles(profiles: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(profiles));
  } catch (err) {
    console.error('Error saving profiles:', err);
  }
}

export function loadActiveProfileId(): string {
  try {
    const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    if (active) return active;
    saveActiveProfileId(DEFAULT_PROFILE.id);
    return DEFAULT_PROFILE.id;
  } catch {
    return DEFAULT_PROFILE.id;
  }
}

export function saveActiveProfileId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
  } catch (err) {
    console.error('Error saving active profile ID:', err);
  }
}

// User-scoped keys
function getSlotsKey(userId: string): string {
  return `goal_tracker_slots_v2_${userId}`;
}

function getRecordsKey(userId: string): string {
  return `goal_tracker_records_v2_${userId}`;
}

function getThemeKey(userId: string): string {
  return `goal_tracker_theme_v2_${userId}`;
}

// User-scoped Theme
export function loadUserTheme(userId: string): AppTheme {
  try {
    const saved = localStorage.getItem(getThemeKey(userId));
    if (saved === 'light' || saved === 'dark') return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  } catch {
    return 'dark';
  }
}

export function saveUserTheme(userId: string, theme: AppTheme): void {
  try {
    localStorage.setItem(getThemeKey(userId), theme);
  } catch (err) {
    console.error('Error saving theme:', err);
  }
}

// User-scoped Schedule Slots
export function loadUserScheduleSlots(userId: string, isNewProfile = false): ScheduleSlot[] {
  try {
    const raw = localStorage.getItem(getSlotsKey(userId));
    if (!raw) {
      if (isNewProfile) {
        saveUserScheduleSlots(userId, []);
        return [];
      }
      saveUserScheduleSlots(userId, INITIAL_SCHEDULE_SLOTS);
      return INITIAL_SCHEDULE_SLOTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SCHEDULE_SLOTS;
  } catch (err) {
    console.error('Error loading schedule slots:', err);
    return INITIAL_SCHEDULE_SLOTS;
  }
}

export function saveUserScheduleSlots(userId: string, slots: ScheduleSlot[]): void {
  try {
    localStorage.setItem(getSlotsKey(userId), JSON.stringify(slots));
  } catch (err) {
    console.error('Error saving schedule slots:', err);
  }
}

// User-scoped Status Records
export function loadUserStatusRecords(userId: string, isNewProfile = false): StatusRecordsMap {
  try {
    const raw = localStorage.getItem(getRecordsKey(userId));
    if (!raw) {
      if (isNewProfile) {
        saveUserStatusRecords(userId, {});
        return {};
      }
      const initRecords = generateInitialStatusRecords();
      saveUserStatusRecords(userId, initRecords);
      return initRecords;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return {};
  } catch (err) {
    console.error('Error loading status records:', err);
    return {};
  }
}

export function saveUserStatusRecords(userId: string, records: StatusRecordsMap): void {
  try {
    localStorage.setItem(getRecordsKey(userId), JSON.stringify(records));
  } catch (err) {
    console.error('Error saving status records:', err);
  }
}

// Clear specific user data
export function clearUserData(userId: string): void {
  try {
    localStorage.removeItem(getSlotsKey(userId));
    localStorage.removeItem(getRecordsKey(userId));
    localStorage.removeItem(getThemeKey(userId));
  } catch (err) {
    console.error('Error clearing user data:', err);
  }
}

// Reset specific user data to sample routine
export function resetUserToDefaultData(userId: string): { slots: ScheduleSlot[]; records: StatusRecordsMap } {
  saveUserScheduleSlots(userId, INITIAL_SCHEDULE_SLOTS);
  const records = generateInitialStatusRecords();
  saveUserStatusRecords(userId, records);
  return { slots: INITIAL_SCHEDULE_SLOTS, records };
}

// Export single user data
export function exportUserDataAsJson(user: UserProfile, slots: ScheduleSlot[], records: StatusRecordsMap): void {
  const data = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    user: {
      id: user.id,
      name: user.name,
    },
    slots,
    records,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedName = user.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  link.download = `goal-tracker-${sanitizedName}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import single user data
export function importUserDataFromJson(jsonStr: string, currentUserId: string): { slots: ScheduleSlot[]; records: StatusRecordsMap; userName?: string } | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && Array.isArray(parsed.slots) && parsed.records) {
      saveUserScheduleSlots(currentUserId, parsed.slots);
      saveUserStatusRecords(currentUserId, parsed.records);
      return {
        slots: parsed.slots,
        records: parsed.records,
        userName: parsed.user?.name,
      };
    }
    return null;
  } catch (err) {
    console.error('Error importing JSON:', err);
    return null;
  }
}
