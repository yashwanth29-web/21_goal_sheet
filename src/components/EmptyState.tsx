import React from 'react';
import { Calendar, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onCreateSchedule: () => void;
  onLoadSample: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onCreateSchedule,
  onLoadSample,
}) => {
  return (
    <div className="w-full rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center my-6 backdrop-blur-xl">
      <div className="w-16 h-16 rounded-3xl bg-indigo-100 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm dark:shadow-lg dark:shadow-indigo-600/10">
        <Calendar className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No schedule created yet</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        Create your first daily goal and start tracking your consistency on the horizontal calendar timetable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onCreateSchedule}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Schedule</span>
        </button>

        <button
          type="button"
          onClick={onLoadSample}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>Load Sample Schedule</span>
        </button>
      </div>
    </div>
  );
};
