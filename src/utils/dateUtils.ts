import type { Period } from '../types';

export interface CalendarDay {
  date: Date;
  dateKey: string; // "YYYY-MM-DD"
  dayOfMonth: number; // 1 to 31
  dayNameShort: string; // "Mon", "Tue"
  dayNameFull: string; // "Monday"
  formattedDisplay: string; // "Oct 05"
  monthNameShort: string; // "Oct"
  year: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isWeekend: boolean;
}

export function formatZero(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = formatZero(d.getMonth() + 1);
  const day = formatZero(d.getDate());
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0); // Noon to avoid timezone skew
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getMonthYearDisplay(year: number, monthIndex: number): string {
  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

export function getDaysInMonth(year: number, monthIndex: number, todayRef = new Date()): CalendarDay[] {
  const todayKey = formatDateKey(todayRef);
  const daysInMonthCount = new Date(year, monthIndex + 1, 0).getDate();
  const days: CalendarDay[] = [];

  for (let d = 1; d <= daysInMonthCount; d++) {
    const date = new Date(year, monthIndex, d, 12, 0, 0);
    const dateKey = `${year}-${formatZero(monthIndex + 1)}-${formatZero(d)}`;
    const dayOfWeek = date.getDay();
    const isToday = dateKey === todayKey;
    const isPast = dateKey < todayKey;
    const isFuture = dateKey > todayKey;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    days.push({
      date,
      dateKey,
      dayOfMonth: d,
      dayNameShort: DAY_SHORT[dayOfWeek],
      dayNameFull: DAY_FULL[dayOfWeek],
      formattedDisplay: `${MONTH_SHORT[monthIndex]} ${formatZero(d)}`,
      monthNameShort: MONTH_SHORT[monthIndex],
      year,
      isToday,
      isPast,
      isFuture,
      isWeekend,
    });
  }

  return days;
}

export function detectPeriodFromTime(timeStr: string): Period {
  if (!timeStr) return 'Morning';
  const upper = timeStr.toUpperCase().trim();
  const isPM = upper.includes('PM');
  const isAM = upper.includes('AM');

  const match = upper.match(/(\d+):?(\d+)?/);
  if (!match) return 'Morning';

  let hour = parseInt(match[1], 10);
  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

export function normalizeTimeString(timeInput: string): string {
  if (!timeInput) return '08:00 AM';
  const trimmed = timeInput.trim();
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(trimmed)) {
    const parts = trimmed.split(/[:\s]+/);
    const h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = parts[2].toUpperCase();
    return `${formatZero(h)}:${m} ${ampm}`;
  }
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    const [hStr, mStr] = trimmed.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr;
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${formatZero(h)}:${m} ${ampm}`;
  }
  return timeInput;
}

export function timeToMinutes(timeStr: string): number {
  const upper = timeStr.toUpperCase().trim();
  const isPM = upper.includes('PM');
  const isAM = upper.includes('AM');
  const match = upper.match(/(\d+):(\d+)/);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10) || 0;
  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  return h * 60 + m;
}

export function sortSlotsByTime<T extends { time: string; order?: number }>(slots: T[]): T[] {
  return [...slots].sort((a, b) => {
    const minA = timeToMinutes(a.time);
    const minB = timeToMinutes(b.time);
    if (minA !== minB) return minA - minB;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}
