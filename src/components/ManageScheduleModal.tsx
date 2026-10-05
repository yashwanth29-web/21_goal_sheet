import React from 'react';
import type { ScheduleSlot } from '../types';
import { X, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { sortSlotsByTime } from '../utils/dateUtils';

interface ManageScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: ScheduleSlot[];
  onAddSlot: () => void;
  onEditSlot: (slot: ScheduleSlot) => void;
  onDeleteSlot: (slot: ScheduleSlot) => void;
  onReorderSlots: (newSlots: ScheduleSlot[]) => void;
}

export const ManageScheduleModal: React.FC<ManageScheduleModalProps> = ({
  isOpen,
  onClose,
  slots,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  onReorderSlots,
}) => {
  if (!isOpen) return null;

  const moveSlot = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slots.length) return;
    const newSlots = [...slots];
    const temp = newSlots[index];
    newSlots[index] = newSlots[targetIndex];
    newSlots[targetIndex] = temp;
    newSlots.forEach((s, idx) => (s.order = idx + 1));
    onReorderSlots(newSlots);
  };

  const autoSortByTime = () => {
    const sorted = sortSlotsByTime(slots);
    sorted.forEach((s, idx) => (s.order = idx + 1));
    onReorderSlots(sorted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl shadow-black/30 dark:shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Manage Daily Schedule Routine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize the time slots and goals that repeat across your calendar
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Time Slot Columns ({slots.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={autoSortByTime}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold hover:underline cursor-pointer"
              >
                Sort Chronologically
              </button>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAddSlot();
                }}
                className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slot</span>
              </button>
            </div>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
              No time slots defined. Click "Add Slot" to create one.
            </div>
          ) : (
            slots.map((slot, index) => {
              const title = slot.workGoal || slot.goalTitle || 'Goal';

              return (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSlot(index, 'up')}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === slots.length - 1}
                        onClick={() => moveSlot(index, 'down')}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{slot.time}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                          {slot.period}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                        {title}
                      </span>
                      {slot.description && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-sm">
                          {slot.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditSlot(slot);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit slot"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onDeleteSlot(slot);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete slot"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddSlot();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-indigo-600/30 text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Slot</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
