import React, { useState, useEffect } from 'react';
import type { ScheduleSlot, Period } from '../types';
import { detectPeriodFromTime, normalizeTimeString, parseTimeRange } from '../utils/dateUtils';
import { X, Clock, Sun, Sunrise, Sunset, Moon, Target, Check, AlertCircle, ArrowRight } from 'lucide-react';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slotData: Omit<ScheduleSlot, 'id' | 'order'> & { id?: string }) => void;
  initialSlot?: ScheduleSlot | null;
  selectedDateText?: string;
}

const PERIOD_OPTIONS: { value: Period; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'Morning', label: 'Morning', icon: <Sunrise className="w-4 h-4 text-amber-500 dark:text-amber-400" />, desc: '05:00 AM - 12:00 PM' },
  { value: 'Afternoon', label: 'Afternoon', icon: <Sun className="w-4 h-4 text-blue-500 dark:text-blue-400" />, desc: '12:00 PM - 05:00 PM' },
  { value: 'Evening', label: 'Evening', icon: <Sunset className="w-4 h-4 text-purple-500 dark:text-purple-400" />, desc: '05:00 PM - 09:00 PM' },
  { value: 'Night', label: 'Night', icon: <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />, desc: '09:00 PM - 05:00 AM' },
];

const QUICK_SUGGESTIONS = [
  'DSA Practice',
  'Mathematics',
  'Project Work',
  'System Design',
  'Workout & Gym',
  'Tech Reading',
  'Code Review',
  'Language Learning',
];

export const AddEditModal: React.FC<AddEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSlot,
  selectedDateText,
}) => {
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');
  const [period, setPeriod] = useState<Period>('Morning');
  const [goalTitle, setGoalTitle] = useState('');
  const [category, setCategory] = useState('Study');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const isEditing = Boolean(initialSlot);

  useEffect(() => {
    if (initialSlot) {
      const { startTime: parsedStart, endTime: parsedEnd } = parseTimeRange(initialSlot.time || '08:00 AM');
      setStartTime(parsedStart);
      setEndTime(parsedEnd);
      setPeriod(initialSlot.period || 'Morning');
      setGoalTitle(initialSlot.goalTitle || initialSlot.workGoal || '');
      setCategory(initialSlot.category || 'Study');
      setDescription(initialSlot.description || '');
    } else {
      setStartTime('08:00 AM');
      setEndTime('10:00 AM');
      setPeriod('Morning');
      setGoalTitle('');
      setCategory('Study');
      setDescription('');
    }
    setError('');
  }, [initialSlot, isOpen]);

  if (!isOpen) return null;

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStartTime(val);
    const detected = detectPeriodFromTime(val);
    setPeriod(detected);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) {
      setError('Please enter a goal or work title.');
      return;
    }
    if (!startTime.trim()) {
      setError('Please specify a start time.');
      return;
    }

    const normStart = normalizeTimeString(startTime);
    const normEnd = endTime.trim() ? normalizeTimeString(endTime) : '';
    const finalTime = normEnd ? `${normStart} - ${normEnd}` : normStart;

    const title = goalTitle.trim();
    onSave({
      id: initialSlot?.id,
      time: finalTime,
      period,
      workGoal: title,
      goalTitle: title,
      category: category.trim() || 'General',
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl shadow-black/30 dark:shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Work Goal' : 'Add Work Goal'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing ? 'Update slot schedule and target' : 'Define time slot range and goal for the daily timetable'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {selectedDateText && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Calendar Reference
              </label>
              <div className="w-full bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                {selectedDateText}
              </div>
            </div>
          )}

          {/* Time Slot Range: Start Time + End Time + Period */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={handleStartTimeChange}
                placeholder="e.g. 05:00 AM"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                End Time <span className="text-[10px] lowercase text-slate-400">(opt)</span>
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="e.g. 07:00 AM"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-2.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {PERIOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block -mt-2">
            Tip: Format times like <code className="text-indigo-600 dark:text-indigo-400">05:00 AM</code>, <code className="text-indigo-600 dark:text-indigo-400">07:30 PM</code>
          </span>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Work / Goal Title
            </label>
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="e.g. DSA Practice, Mathematics, Project Work"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none font-medium"
              required
            />

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Suggestions:</span>
              {QUICK_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setGoalTitle(sug)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Study, Work, Health..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Description / Details (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Solve 2 problems / review chapter 4"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Goal Slot'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

