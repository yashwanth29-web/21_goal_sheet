import React from 'react';
import type { ScheduleSlot, GoalStatus, StatusRecordsMap } from '../types';
import type { CalendarDay } from '../utils/dateUtils';
import {
  Check,
  Clock,
  StickyNote,
  Sparkles,
  CheckCheck,
  Plus,
} from 'lucide-react';

interface TodayGoalsCardProps {
  todayDay: CalendarDay;
  slots: ScheduleSlot[];
  statusRecords: StatusRecordsMap;
  isCheatDay?: boolean;
  onStatusChange: (dateKey: string, slotId: string, status: GoalStatus) => void;
  onOpenNote: (slot: ScheduleSlot, dateKey: string, currentNote?: string) => void;
  onMarkAllCompleted: () => void;
  onAddGoal: () => void;
}

export const TodayGoalsCard: React.FC<TodayGoalsCardProps> = ({
  todayDay,
  slots,
  statusRecords,
  isCheatDay = false,
  onStatusChange,
  onOpenNote,
  onMarkAllCompleted,
  onAddGoal,
}) => {
  if (slots.length === 0) {
    return null;
  }

  const cycleStatus = (currentStatus: GoalStatus): GoalStatus => {
    if (currentStatus === 'none') return 'completed';
    if (currentStatus === 'completed') return 'partial';
    if (currentStatus === 'partial') return 'missed';
    return 'none';
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-md dark:shadow-xl backdrop-blur-xl p-3.5 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
              <span>Today's Routine</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {slots.length}
              </span>
            </h3>
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-1.5">
          {!isCheatDay && (
            <button
              type="button"
              onClick={onMarkAllCompleted}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Mark all goals Completed"
            >
              <CheckCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>All Done</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddGoal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Add a goal to routine"
          >
            <Plus className="w-3 h-3" />
            <span>Goal</span>
          </button>
        </div>
      </div>

      {/* Routine Task Items */}
      {isCheatDay ? (
        <div className="py-6 text-center">
          <span className="text-2xl">🌴</span>
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-1">
            Rest Day Active
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50 mt-1">
          {slots.map((slot) => {
            const key = `${todayDay.dateKey}_${slot.id}`;
            const record = statusRecords[key];
            const status: GoalStatus = record?.status || 'none';
            const hasNote = Boolean(record?.note && record.note.trim().length > 0);
            const goalTitle = slot.workGoal || slot.goalTitle || 'Goal';
            const isCompleted = status === 'completed';

            return (
              <div
                key={slot.id}
                className="py-2.5 px-1 flex items-center justify-between gap-3 group/task transition-all hover:bg-slate-50/70 dark:hover:bg-slate-800/30 rounded-xl"
              >
                {/* Left: 1-Tap Checkbox Circle + Title */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Interactive Checkbox Circle */}
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        todayDay.dateKey,
                        slot.id,
                        isCompleted ? 'none' : 'completed'
                      )
                    }
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300 dark:ring-emerald-600'
                        : status === 'partial'
                        ? 'bg-amber-400 text-white ring-2 ring-amber-300 dark:ring-amber-600'
                        : status === 'missed'
                        ? 'bg-rose-500 text-white ring-2 ring-rose-300 dark:ring-rose-600'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-800'
                    }`}
                    title={isCompleted ? 'Mark unselected' : 'Tap to mark Completed'}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : status === 'partial' ? (
                      <span className="text-[10px] font-black leading-none">½</span>
                    ) : status === 'missed' ? (
                      <span className="text-[10px] font-black leading-none">✕</span>
                    ) : null}
                  </button>

                  {/* Goal Info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-bold truncate transition-all ${
                        isCompleted
                          ? 'text-slate-400 dark:text-slate-500 line-through'
                          : 'text-slate-900 dark:text-white'
                      }`}
                      title={goalTitle}
                    >
                      {goalTitle}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-mono font-semibold flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        {slot.time}
                      </span>
                      {slot.category && (
                        <>
                          <span>•</span>
                          <span className="font-medium truncate text-indigo-600 dark:text-indigo-400">
                            {slot.category}
                          </span>
                        </>
                      )}
                      {hasNote && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 truncate">
                            <StickyNote className="w-2.5 h-2.5" />
                            <span>"{record?.note}"</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Status Cycle Badge + Note Button */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Status Cycle Badge */}
                  <button
                    type="button"
                    onClick={() => onStatusChange(todayDay.dateKey, slot.id, cycleStatus(status))}
                    className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : status === 'partial'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : status === 'missed'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                    title="Click to cycle status: Done → Partial → Missed → None"
                  >
                    {isCompleted
                      ? 'Done'
                      : status === 'partial'
                      ? 'Partial'
                      : status === 'missed'
                      ? 'Missed'
                      : 'Status'}
                  </button>

                  {/* Note Button */}
                  <button
                    type="button"
                    onClick={() => onOpenNote(slot, todayDay.dateKey, record?.note)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      hasNote
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={hasNote ? 'Edit note' : 'Add reflection note'}
                  >
                    <StickyNote className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
