import React, { useState, useRef, useEffect } from 'react';
import type { ScheduleSlot, GoalStatus, StatusRecordsMap } from '../types';
import type { CalendarDay } from '../utils/dateUtils';
import { getSlotUnlockInfo } from '../utils/dateUtils';
import {
  Check,
  Clock,
  StickyNote,
  Sparkles,
  CheckCheck,
  Plus,
  Edit2,
  Trash2,
  Lock,
  AlertCircle,
  X,
  CheckCircle2,
  XCircle,
  CircleDashed,
  Leaf,
} from 'lucide-react';


interface TodayGoalsCardProps {
  todayDay: CalendarDay;
  slots: ScheduleSlot[];
  statusRecords: StatusRecordsMap;
  isCheatDay?: boolean;
  onStatusChange: (dateKey: string, slotId: string, status: GoalStatus) => void;
  onOpenNote: (slot: ScheduleSlot, dateKey: string, currentNote?: string) => void;
  onEditSlot: (slot: ScheduleSlot) => void;
  onDeleteSlot: (slot: ScheduleSlot) => void;
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
  onEditSlot,
  onDeleteSlot,
  onMarkAllCompleted,
  onAddGoal,
}) => {
  const [activePickerSlotId, setActivePickerSlotId] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setActivePickerSlotId(null);
      }
    }
    if (activePickerSlotId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePickerSlotId]);

  if (slots.length === 0) {
    return null;
  }

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
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-xs transition-transform hover:scale-105 cursor-pointer"
            title="Add a goal to routine"
          >
            <Plus className="w-3 h-3" />
            <span>+ Goal</span>
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
            const rawNote = record?.note || '';
            const isProductiveNote = rawNote.startsWith('[PRODUCTIVE]: ');
            const cleanNote = isProductiveNote ? rawNote.replace('[PRODUCTIVE]: ', '') : rawNote;
            const hasNote = Boolean(cleanNote.trim().length > 0);
            const goalTitle = slot.workGoal || slot.goalTitle || 'Goal';
            const isCompleted = status === 'completed';

            const unlockInfo = getSlotUnlockInfo(todayDay.dateKey, slot.time);
            const isPickerOpen = activePickerSlotId === slot.id;

            return (
              <div
                key={slot.id}
                className={`relative py-2.5 px-2 flex items-center justify-between gap-2.5 group/task transition-all rounded-xl ${
                  isProductiveNote
                    ? 'border-l-4 border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                    : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                }`}
              >
                {/* Left: Checkbox Circle + Title */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Interactive Status Selector Trigger Circle */}
                  <button
                    type="button"
                    onClick={() => setActivePickerSlotId(isPickerOpen ? null : slot.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300 dark:ring-emerald-600'
                        : status === 'partial'
                        ? 'bg-amber-400 text-white ring-2 ring-amber-300 dark:ring-amber-600'
                        : status === 'missed'
                        ? 'bg-rose-500 text-white ring-2 ring-rose-300 dark:ring-rose-600'
                        : isProductiveNote
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-600'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-800'
                    }`}
                    title={
                      !unlockInfo.isUnlocked
                        ? `Goal in progress (Opens at ${unlockInfo.unlockTimeStr}) - Click to choose status`
                        : 'Click to choose status: Done, Partial, Missed, Status'
                    }
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : status === 'partial' ? (
                      <span className="text-[10px] font-black leading-none">½</span>
                    ) : status === 'missed' ? (
                      <span className="text-[10px] font-black leading-none">✕</span>
                    ) : isProductiveNote ? (
                      <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    ) : !unlockInfo.isUnlocked ? (
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
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
                    <div className="flex items-center flex-wrap gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-mono font-semibold flex items-center gap-0.5 whitespace-nowrap">
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

                      {/* Productive Unscheduled Work Note Highlight */}
                      {isProductiveNote ? (
                        <div className="w-full sm:w-auto flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md text-[10.5px]">
                          <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">🌿 Productive Hustle: "{cleanNote}"</span>
                        </div>
                      ) : (
                        hasNote && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 truncate max-w-[200px]">
                              <StickyNote className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">"{cleanNote}"</span>
                            </span>
                          </>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Strip: Status Badge + Note + Edit + Delete */}
                <div className="flex items-center gap-1 shrink-0 relative">
                  {/* Status Button (Opens 4-Choice Quick Selector) */}
                  <button
                    type="button"
                    onClick={() => setActivePickerSlotId(isPickerOpen ? null : slot.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : status === 'partial'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : status === 'missed'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                    title="Click to select status: Done, Partial, Missed, or Reset"
                  >
                    {!unlockInfo.isUnlocked && status === 'none' && (
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                    )}
                    <span>
                      {isCompleted
                        ? 'Done'
                        : status === 'partial'
                        ? 'Partial'
                        : status === 'missed'
                        ? 'Missed'
                        : 'Status'}
                    </span>
                  </button>

                  {/* Note Button */}
                  <button
                    type="button"
                    onClick={() => onOpenNote(slot, todayDay.dateKey, record?.note)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isProductiveNote
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60'
                        : hasNote
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={
                      isProductiveNote
                        ? 'Edit Productive Alternate Work note'
                        : hasNote
                        ? 'Edit note'
                        : 'Add reflection or productive note'
                    }
                  >
                    <StickyNote className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit Goal Button */}
                  <button
                    type="button"
                    onClick={() => onEditSlot(slot)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                    title="Edit goal (time, title, category)"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Goal Button */}
                  <button
                    type="button"
                    onClick={() => onDeleteSlot(slot)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                    title="Delete goal from routine"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* 4-CHOICE STATUS QUICK SELECTOR POPOVER */}
                  {isPickerOpen && (
                    <div
                      ref={pickerRef}
                      className="absolute right-0 top-8 z-50 w-64 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl animate-in fade-in zoom-in-95"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Select Goal Status
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePickerSlotId(null)}
                          className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {!unlockInfo.isUnlocked && (
                        <div className="mb-2 p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[10px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Lock className="w-3 h-3 shrink-0" />
                          <span>Goal active. Unlocks at <b>{unlockInfo.unlockTimeStr}</b></span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-1.5">
                        {/* 1. DONE */}
                        <button
                          type="button"
                          onClick={() => {
                            onStatusChange(todayDay.dateKey, slot.id, 'completed');
                            setActivePickerSlotId(null);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Done</span>
                        </button>

                        {/* 2. PARTIAL */}
                        <button
                          type="button"
                          onClick={() => {
                            onStatusChange(todayDay.dateKey, slot.id, 'partial');
                            setActivePickerSlotId(null);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            status === 'partial'
                              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Partial</span>
                        </button>

                        {/* 3. MISSED */}
                        <button
                          type="button"
                          onClick={() => {
                            onStatusChange(todayDay.dateKey, slot.id, 'missed');
                            setActivePickerSlotId(null);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            status === 'missed'
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
                              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Missed</span>
                        </button>

                        {/* 4. STATUS (RESET) */}
                        <button
                          type="button"
                          onClick={() => {
                            onStatusChange(todayDay.dateKey, slot.id, 'none');
                            setActivePickerSlotId(null);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            status === 'none'
                              ? 'bg-slate-700 text-white dark:bg-slate-700 ring-2 ring-slate-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <CircleDashed className="w-3.5 h-3.5 shrink-0" />
                          <span>Status</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

