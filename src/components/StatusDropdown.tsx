import React, { useState, useRef, useEffect } from 'react';
import type { GoalStatus } from '../types';
import { CheckCircle2, AlertCircle, XCircle, CircleDashed, ChevronDown } from 'lucide-react';

interface StatusDropdownProps {
  status: GoalStatus;
  onChange: (newStatus: GoalStatus) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

interface StatusOption {
  value: GoalStatus;
  label: string;
  icon: React.ReactNode;
  badgeClass: string;
  pillClass: string;
}

export const STATUS_CONFIG: Record<GoalStatus, StatusOption> = {
  none: {
    value: 'none',
    label: 'Select Status',
    icon: <CircleDashed className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />,
    badgeClass: 'bg-slate-100/90 text-slate-600 border-slate-300 hover:border-slate-400 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60 dark:hover:border-slate-500',
    pillClass: 'text-slate-500 dark:text-slate-400',
  },
  completed: {
    value: 'completed',
    label: 'Completed',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-emerald-400 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-500/50 dark:hover:border-emerald-400 shadow-[0_0_12px_-3px_rgba(16,185,129,0.2)]',
    pillClass: 'text-emerald-600 dark:text-emerald-400 font-semibold',
  },
  partial: {
    value: 'partial',
    label: 'Partially Completed',
    icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 hover:border-amber-400 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-500/50 dark:hover:border-amber-400 shadow-[0_0_12px_-3px_rgba(245,158,11,0.2)]',
    pillClass: 'text-amber-600 dark:text-amber-400 font-semibold',
  },
  missed: {
    value: 'missed',
    label: 'Missed',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-300 hover:border-rose-400 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-500/50 dark:hover:border-rose-400 shadow-[0_0_12px_-3px_rgba(244,63,94,0.2)]',
    pillClass: 'text-rose-600 dark:text-rose-400 font-semibold',
  },
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  status = 'none',
  onChange,
  disabled = false,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = STATUS_CONFIG[status] || STATUS_CONFIG.none;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: GoalStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${current.badgeClass} ${
          size === 'sm' ? 'py-1 px-2 text-[11px]' : ''
        }`}
        title={`Current status: ${current.label}`}
      >
        <span className="flex items-center gap-1.5 truncate">
          {current.icon}
          <span className="truncate">{current.label}</span>
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-slate-600 dark:text-slate-200' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 min-w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl shadow-black/30 dark:shadow-black/80 py-1.5 animate-in fade-in zoom-in-95 duration-100 right-0 left-0 sm:left-auto">
          <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
            Set Status
          </div>

          {(['completed', 'partial', 'missed', 'none'] as GoalStatus[]).map((key) => {
            const opt = STATUS_CONFIG[key];
            const isSelected = status === key;

            return (
              <button
                key={key}
                type="button"
                onClick={(e) => handleSelect(key, e)}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800/80 font-medium text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0 shadow-[0_0_6px_rgba(129,140,248,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
