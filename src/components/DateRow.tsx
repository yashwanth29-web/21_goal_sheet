import React from 'react';
import type { CalendarDay } from '../utils/dateUtils';
import type { ScheduleSlot, GoalStatus, StatusRecordsMap, CellStatusRecord } from '../types';
import { GoalCell } from './GoalCell';
import { CheckCheck, RotateCcw } from 'lucide-react';

interface DateRowProps {
  day: CalendarDay;
  slots: ScheduleSlot[];
  statusRecords: StatusRecordsMap;
  isCheatDay?: boolean;
  onToggleCheatDay?: (dateKey: string) => void;
  onStatusChange: (dateKey: string, slotId: string, newStatus: GoalStatus) => void;
  onEditSlot: (slot: ScheduleSlot) => void;
  onDeleteSlot: (slot: ScheduleSlot) => void;
  onOpenNote: (slot: ScheduleSlot, dateKey: string, currentNote?: string) => void;
  onMarkAllDayCompleted: (dateKey: string) => void;
  onResetDayStatuses: (dateKey: string) => void;
}

export const DateRow: React.FC<DateRowProps> = ({
  day,
  slots,
  statusRecords,
  isCheatDay = false,
  onToggleCheatDay,
  onStatusChange,
  onEditSlot,
  onDeleteSlot,
  onOpenNote,
  onMarkAllDayCompleted,
  onResetDayStatuses,
}) => {
  let completedCount = 0;
  let partialCount = 0;
  let missedCount = 0;
  let filledCount = 0;

  slots.forEach((slot) => {
    const key = `${day.dateKey}_${slot.id}`;
    const rec = statusRecords[key];
    if (rec?.status === 'completed') {
      completedCount++;
      filledCount++;
    } else if (rec?.status === 'partial') {
      partialCount++;
      filledCount++;
    } else if (rec?.status === 'missed') {
      missedCount++;
      filledCount++;
    }
  });

  const totalSlots = slots.length;
  const dayAchievementPct = totalSlots > 0 ? Math.round(((completedCount + partialCount * 0.5) / totalSlots) * 100) : 0;

  return (
    <tr
      id={`date-row-${day.dateKey}`}
      className={`group/row transition-colors duration-150 border-b border-slate-200 dark:border-slate-800/80 ${
        isCheatDay
          ? 'bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50/80 dark:hover:bg-amber-950/30'
          : day.isToday
          ? 'bg-indigo-50/70 dark:bg-indigo-950/25 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
          : day.isWeekend
          ? 'bg-slate-50/80 dark:bg-slate-950/60 hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
          : 'bg-white dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-900/60'
      }`}
    >
      <td
        className={`sticky left-0 z-20 p-2 sm:p-3.5 w-[110px] min-w-[110px] sm:w-[185px] sm:min-w-[185px] border-r border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors ${
          isCheatDay
            ? 'bg-amber-50/95 dark:bg-slate-950/95 shadow-[4px_0_12px_rgba(245,158,11,0.1)] ring-1 ring-inset ring-amber-400/40'
            : day.isToday
            ? 'bg-indigo-50/95 dark:bg-slate-900/95 shadow-[4px_0_12px_rgba(79,70,229,0.08)] dark:shadow-[4px_0_12px_rgba(79,70,229,0.15)] ring-1 ring-inset ring-indigo-500/40'
            : 'bg-white/95 dark:bg-slate-950/95 group-hover/row:bg-slate-50/95 dark:group-hover/row:bg-slate-900/95 shadow-[4px_0_10px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_10px_rgba(0,0,0,0.3)]'
        }`}
      >
        <div className="flex flex-col gap-1">
          {/* Date and Day Tag */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <span
                className={`text-xs sm:text-base font-bold font-mono tracking-tight ${
                  day.isToday ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {day.formattedDisplay}
              </span>
              <span
                className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded font-semibold ${
                  day.isWeekend
                    ? 'bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {day.dayNameShort}
              </span>
            </div>

            {isCheatDay ? (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full w-max shadow-sm">
                🌴 Cheat Day
              </span>
            ) : day.isToday ? (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full w-max animate-pulse-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-ping" />
                Today
              </span>
            ) : null}
          </div>

          {/* Progress Counts and Percent */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isCheatDay ? (
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold italic">
                Excluded from target
              </span>
            ) : (
              <span className="flex items-center gap-0.5 sm:gap-1 font-mono">
                {filledCount > 0 ? (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{completedCount}</span>
                    {partialCount > 0 && <span className="text-amber-600 dark:text-amber-400">+{partialCount}p</span>}
                    {missedCount > 0 && <span className="text-rose-600 dark:text-rose-400">+{missedCount}m</span>}
                    <span className="text-slate-400 dark:text-slate-500">/{totalSlots}</span>
                  </>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 text-[10px]">0/{totalSlots}</span>
                )}
              </span>
            )}

            {!isCheatDay && filledCount > 0 && (
              <span
                className={`text-[10px] sm:text-[11px] font-bold font-mono ${
                  dayAchievementPct >= 80
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : dayAchievementPct >= 50
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {dayAchievementPct}%
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-1 sm:h-1.5 rounded-full overflow-hidden flex gap-0.5 mt-0.5">
            {isCheatDay ? (
              <div className="bg-amber-400 dark:bg-amber-500 h-full w-full opacity-60" title="Cheat Day / Holiday" />
            ) : totalSlots > 0 ? (
              <>
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(completedCount / totalSlots) * 100}%` }}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${(partialCount / totalSlots) * 100}%` }}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${(missedCount / totalSlots) * 100}%` }}
                />
              </>
            ) : null}
          </div>

          {/* Row Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1 sm:opacity-90 group-hover/row:opacity-100 transition-opacity">
            {onToggleCheatDay && (
              <button
                type="button"
                onClick={() => onToggleCheatDay(day.dateKey)}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                  isCheatDay
                    ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 hover:bg-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:text-amber-800 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700'
                }`}
                title={isCheatDay ? 'Restore this day as active target day' : 'Mark this day as Cheat Day / Holiday (Excluded from monthly goal target)'}
              >
                <span>🌴</span>
                <span>{isCheatDay ? 'Cheat Day' : 'Cheat Day'}</span>
              </button>
            )}

            {!isCheatDay && (
              <>
                <button
                  type="button"
                  onClick={() => onMarkAllDayCompleted(day.dateKey)}
                  className="flex items-center gap-0.5 text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline cursor-pointer font-medium"
                  title="Mark all goals for this day as Completed"
                >
                  <CheckCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>All Done</span>
                </button>
                {filledCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onResetDayStatuses(day.dateKey)}
                    className="flex items-center gap-0.5 text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:underline cursor-pointer font-medium"
                    title="Reset all statuses for this day"
                  >
                    <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </td>

      {slots.map((slot) => {
        const key = `${day.dateKey}_${slot.id}`;
        const record: CellStatusRecord | undefined = statusRecords[key];

        return (
          <td key={slot.id} className="p-1.5 sm:p-2.5 align-top min-w-[170px] sm:min-w-[210px] max-w-[200px] sm:max-w-[240px]">
            <GoalCell
              slot={slot}
              dateKey={day.dateKey}
              record={record}
              onStatusChange={(newStatus) => onStatusChange(day.dateKey, slot.id, newStatus)}
              onEditSlot={onEditSlot}
              onDeleteSlot={onDeleteSlot}
              onOpenNote={onOpenNote}
              isToday={day.isToday}
            />
          </td>
        );
      })}
    </tr>
  );
};
