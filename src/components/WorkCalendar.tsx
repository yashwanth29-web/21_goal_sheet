import React, { useRef, useEffect } from 'react';
import type { CalendarDay } from '../utils/dateUtils';
import type { ScheduleSlot, GoalStatus, StatusRecordsMap } from '../types';
import { DateRow } from './DateRow';
import { Plus, Clock, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';

interface WorkCalendarProps {
  days: CalendarDay[];
  slots: ScheduleSlot[];
  statusRecords: StatusRecordsMap;
  onStatusChange: (dateKey: string, slotId: string, newStatus: GoalStatus) => void;
  onEditSlot: (slot: ScheduleSlot) => void;
  onDeleteSlot: (slot: ScheduleSlot) => void;
  onAddSlot: () => void;
  onOpenNote: (slot: ScheduleSlot, dateKey: string, currentNote?: string) => void;
  onMarkAllDayCompleted: (dateKey: string) => void;
  onResetDayStatuses: (dateKey: string) => void;
  selectedMonthName: string;
}

function getPeriodDisplay(periodStr: string): { pill: string; label: string; dot: string } {
  const upper = String(periodStr).toUpperCase();
  if (upper === 'AFTERNOON') {
    return { pill: 'period-afternoon', label: 'Afternoon', dot: 'bg-blue-500 dark:bg-blue-400' };
  }
  if (upper === 'EVENING') {
    return { pill: 'period-evening', label: 'Evening', dot: 'bg-purple-500 dark:bg-purple-400' };
  }
  if (upper === 'NIGHT') {
    return { pill: 'period-night', label: 'Night', dot: 'bg-indigo-500 dark:bg-indigo-400' };
  }
  return { pill: 'period-morning', label: 'Morning', dot: 'bg-amber-500 dark:bg-amber-400' };
}

export const WorkCalendar: React.FC<WorkCalendarProps> = ({
  days,
  slots,
  statusRecords,
  onStatusChange,
  onEditSlot,
  onDeleteSlot,
  onAddSlot,
  onOpenNote,
  onMarkAllDayCompleted,
  onResetDayStatuses,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const todayElement = document.getElementById(`date-row-${days.find((d) => d.isToday)?.dateKey}`);
    if (todayElement && scrollContainerRef.current) {
      setTimeout(() => {
        todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [days]);

  const scrollHorizontally = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-xl dark:shadow-2xl backdrop-blur-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Timetable Grid</span>
          <span className="text-slate-300 dark:text-slate-500">•</span>
          <span>{days.length} Days</span>
          <span className="text-slate-300 dark:text-slate-500">•</span>
          <span>{slots.length} Goal Slots</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollHorizontally('left')}
            className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Scroll timetable left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollHorizontally('right')}
            className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Scroll timetable right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto overflow-y-auto max-h-[72vh] custom-scrollbar select-none"
      >
        <table className="w-full border-collapse text-left min-w-max">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
              <th className="sticky top-0 left-0 z-30 p-3 sm:p-4 min-w-[170px] sm:min-w-[190px] bg-slate-50/98 dark:bg-slate-950/98 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-xs shadow-[4px_0_10px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_10px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <Clock className="w-3.5 h-3.5" />
                    DATE
                  </span>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 capitalize">Daily Progress</span>
                </div>
              </th>

              {slots.map((slot) => {
                const periodInfo = getPeriodDisplay(slot.period);
                const title = slot.workGoal || slot.goalTitle || 'Goal';

                return (
                  <th
                    key={slot.id}
                    className="sticky top-0 z-20 p-3 sm:p-4 min-w-[210px] max-w-[240px] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800/60 font-medium text-xs align-top group"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                          {slot.time}
                        </span>

                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => onEditSlot(slot)}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                            title="Edit this time slot"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteSlot(slot)}
                            className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                            title="Delete this time slot"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${periodInfo.pill}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${periodInfo.dot}`} />
                          {periodInfo.label}
                        </span>
                      </div>

                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm truncate">
                        {title}
                      </div>
                    </div>
                  </th>
                );
              })}

              <th className="sticky top-0 z-20 p-3 sm:p-4 min-w-[140px] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md align-middle text-center">
                <button
                  type="button"
                  onClick={onAddSlot}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl border border-dashed border-indigo-400 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-indigo-600/20 hover:border-indigo-500 transition-all text-xs font-semibold cursor-pointer group"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
                  <span>Add Slot</span>
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {days.map((day) => (
              <DateRow
                key={day.dateKey}
                day={day}
                slots={slots}
                statusRecords={statusRecords}
                onStatusChange={onStatusChange}
                onEditSlot={onEditSlot}
                onDeleteSlot={onDeleteSlot}
                onOpenNote={onOpenNote}
                onMarkAllDayCompleted={onMarkAllDayCompleted}
                onResetDayStatuses={onResetDayStatuses}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
