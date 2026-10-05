import React from 'react';
import type { CalendarDay } from '../utils/dateUtils';
import type { ScheduleSlot, GoalStatus, StatusRecordsMap, CellStatusRecord } from '../types';
import { GoalCell } from './GoalCell';
import { CheckCheck, RotateCcw } from 'lucide-react';

interface DateRowProps {
  day: CalendarDay;
  slots: ScheduleSlot[];
  statusRecords: StatusRecordsMap;
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
        day.isToday
          ? 'bg-indigo-50/70 dark:bg-indigo-950/25 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
          : day.isWeekend
          ? 'bg-slate-50/80 dark:bg-slate-950/60 hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
          : 'bg-white dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-900/60'
      }`}
    >
      <td
        className={`sticky left-0 z-20 p-3 sm:p-4 min-w-[170px] sm:min-w-[190px] border-r border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors ${
          day.isToday
            ? 'bg-indigo-50/95 dark:bg-slate-900/95 shadow-[4px_0_12px_rgba(79,70,229,0.08)] dark:shadow-[4px_0_12px_rgba(79,70,229,0.15)] ring-1 ring-inset ring-indigo-500/40'
            : 'bg-white/95 dark:bg-slate-950/95 group-hover/row:bg-slate-50/95 dark:group-hover/row:bg-slate-900/95 shadow-[4px_0_10px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_10px_rgba(0,0,0,0.3)]'
        }`}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm sm:text-base font-bold font-mono ${
                  day.isToday ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {day.formattedDisplay}
              </span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  day.isWeekend
                    ? 'bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {day.dayNameShort}
              </span>
            </div>

            {day.isToday && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40 px-2 py-0.5 rounded-full animate-pulse-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-ping" />
                Today
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="flex items-center gap-1 font-mono">
              {filledCount > 0 ? (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{completedCount}</span>
                  {partialCount > 0 && <span className="text-amber-600 dark:text-amber-400">+{partialCount}p</span>}
                  {missedCount > 0 && <span className="text-rose-600 dark:text-rose-400">+{missedCount}m</span>}
                  <span>/{totalSlots}</span>
                </>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">Not tracked</span>
              )}
            </span>

            {filledCount > 0 && (
              <span
                className={`text-[11px] font-semibold font-mono ${
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

          <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden flex gap-0.5 mt-1">
            {totalSlots > 0 && (
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
            )}
          </div>

          <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onMarkAllDayCompleted(day.dateKey)}
              className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline cursor-pointer"
              title="Mark all goals for this day as Completed"
            >
              <CheckCheck className="w-3 h-3" />
              <span>All Done</span>
            </button>
            {filledCount > 0 && (
              <button
                type="button"
                onClick={() => onResetDayStatuses(day.dateKey)}
                className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:underline cursor-pointer"
                title="Reset all statuses for this day"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </td>

      {slots.map((slot) => {
        const key = `${day.dateKey}_${slot.id}`;
        const record: CellStatusRecord | undefined = statusRecords[key];

        return (
          <td key={slot.id} className="p-2 sm:p-2.5 align-top min-w-[210px] max-w-[240px]">
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
