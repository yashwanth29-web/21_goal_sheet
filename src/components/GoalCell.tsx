import React, { useState, useRef, useEffect } from 'react';
import type { ScheduleSlot, GoalStatus, CellStatusRecord } from '../types';
import { StatusDropdown } from './StatusDropdown';
import { MoreVertical, Edit2, Trash2, StickyNote, RotateCcw } from 'lucide-react';

interface GoalCellProps {
  slot: ScheduleSlot;
  dateKey: string;
  record?: CellStatusRecord;
  onStatusChange: (newStatus: GoalStatus) => void;
  onEditSlot: (slot: ScheduleSlot) => void;
  onDeleteSlot: (slot: ScheduleSlot) => void;
  onOpenNote: (slot: ScheduleSlot, dateKey: string, currentNote?: string) => void;
  isToday?: boolean;
}

export const GoalCell: React.FC<GoalCellProps> = ({
  slot,
  dateKey,
  record,
  onStatusChange,
  onEditSlot,
  onDeleteSlot,
  onOpenNote,
  isToday = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const status: GoalStatus = record?.status || 'none';
  const hasNote = Boolean(record?.note && record.note.trim().length > 0);
  const goalTitle = slot.workGoal || slot.goalTitle || 'Goal';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  let cellStatusStyle =
    'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/40 shadow-sm dark:shadow-none';
  let indicatorGlow = '';

  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'completed') {
    cellStatusStyle =
      'border-emerald-300 bg-emerald-50/70 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30';
    indicatorGlow = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]';
  } else if (normalizedStatus === 'partial' || normalizedStatus === 'partially_completed') {
    cellStatusStyle =
      'border-amber-300 bg-amber-50/70 hover:bg-amber-50 dark:border-amber-500/30 dark:bg-amber-950/20 dark:hover:bg-amber-950/30';
    indicatorGlow = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
  } else if (normalizedStatus === 'missed') {
    cellStatusStyle =
      'border-rose-300 bg-rose-50/70 hover:bg-rose-50 dark:border-rose-500/30 dark:bg-rose-950/20 dark:hover:bg-rose-950/30';
    indicatorGlow = 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
  }

  return (
    <div
      className={`group relative flex flex-col justify-between p-2 sm:p-2.5 min-w-[170px] sm:min-w-[200px] w-full max-w-[200px] sm:max-w-[240px] rounded-xl border transition-all duration-200 ${cellStatusStyle} ${
        isToday ? 'ring-2 ring-indigo-500/40 dark:ring-indigo-500/30' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5">
          {status !== 'none' ? (
            <span className={`w-2 h-2 rounded-full shrink-0 ${indicatorGlow}`} />
          ) : (
            <span className="w-2 h-2 rounded-full shrink-0 bg-slate-300 dark:bg-slate-700" />
          )}

          {hasNote && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenNote(slot, dateKey, record?.note);
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors p-0.5"
              title={`Note: ${record?.note}`}
            >
              <StickyNote className="w-3 h-3 fill-indigo-400/20" />
            </button>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer focus:opacity-100"
            title="Goal options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 py-1 text-xs animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenNote(slot, dateKey, record?.note);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                <StickyNote className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>{hasNote ? 'Edit Note' : 'Add Note'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEditSlot(slot);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>Edit Goal Slot</span>
              </button>

              {status !== 'none' && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onStatusChange('none');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Reset Status</span>
                </button>
              )}

              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteSlot(slot);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span>Delete Goal Slot</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2">
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm leading-snug line-clamp-2 tracking-tight">
          {goalTitle}
        </h4>
        {slot.description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5" title={slot.description}>
            {slot.description}
          </p>
        )}
      </div>

      <div className="mt-auto pt-1">
        <StatusDropdown status={status} onChange={onStatusChange} />
      </div>
    </div>
  );
};
