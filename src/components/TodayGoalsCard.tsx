import React from 'react';
import type { ScheduleSlot, GoalStatus, StatusRecordsMap } from '../types';
import type { CalendarDay } from '../utils/dateUtils';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  StickyNote,
  Sparkles,
  CheckCheck,
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

function getPeriodColor(period: string) {
  const p = period.toUpperCase();
  if (p === 'MORNING') return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800';
  if (p === 'AFTERNOON') return 'text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800';
  if (p === 'EVENING') return 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800';
  return 'text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800';
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

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 shadow-md dark:shadow-xl backdrop-blur-xl p-3.5 sm:p-5">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Today's Action Checklist</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {slots.length} items
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tap status pills to mark your progress in 1 click
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCheatDay && (
            <button
              type="button"
              onClick={onMarkAllCompleted}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Mark all of today's goals as Completed"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Mark All Done</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddGoal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold transition-all cursor-pointer hover:scale-105"
            title="Add a new goal to routine"
          >
            <span>+ Goal</span>
          </button>
        </div>
      </div>

      {/* List of Goals */}
      {isCheatDay ? (
        <div className="py-8 text-center px-4">
          <span className="text-3xl">🌴</span>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mt-2">
            Today is a designated Rest / Cheat Day!
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            No daily targets are tracked today. Recharge your energy for tomorrow!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-1">
          {slots.map((slot) => {
            const key = `${todayDay.dateKey}_${slot.id}`;
            const record = statusRecords[key];
            const currentStatus: GoalStatus = record?.status || 'none';
            const hasNote = Boolean(record?.note && record.note.trim().length > 0);
            const goalTitle = slot.workGoal || slot.goalTitle || 'Goal';

            return (
              <div
                key={slot.id}
                className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-xl px-2"
              >
                {/* Left: Time & Title */}
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="flex flex-col items-start gap-1 shrink-0 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {slot.time}
                    </span>
                    <span
                      className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-md border ${getPeriodColor(
                        slot.period
                      )}`}
                    >
                      {slot.period}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-bold truncate ${
                        currentStatus === 'completed'
                          ? 'text-slate-500 dark:text-slate-400 line-through'
                          : 'text-slate-900 dark:text-white'
                      }`}
                      title={goalTitle}
                    >
                      {goalTitle}
                    </p>
                    {slot.category && (
                      <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">
                        {slot.category}
                      </span>
                    )}
                    {hasNote && (
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 italic mt-0.5 flex items-center gap-1">
                        <StickyNote className="w-3 h-3 shrink-0" />
                        <span className="truncate">"{record?.note}"</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Touch-Friendly 1-Tap Status Selector */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        todayDay.dateKey,
                        slot.id,
                        currentStatus === 'completed' ? 'none' : 'completed'
                      )
                    }
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      currentStatus === 'completed'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    }`}
                    title="Mark Completed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        todayDay.dateKey,
                        slot.id,
                        currentStatus === 'partial' ? 'none' : 'partial'
                      )
                    }
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      currentStatus === 'partial'
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                    }`}
                    title="Mark Partial"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Partial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        todayDay.dateKey,
                        slot.id,
                        currentStatus === 'missed' ? 'none' : 'missed'
                      )
                    }
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      currentStatus === 'missed'
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    }`}
                    title="Mark Missed"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Missed</span>
                  </button>

                  {/* Note Button */}
                  <button
                    type="button"
                    onClick={() => onOpenNote(slot, todayDay.dateKey, record?.note)}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                      hasNote
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                    title={hasNote ? 'Edit note for today' : 'Add reflection note'}
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
