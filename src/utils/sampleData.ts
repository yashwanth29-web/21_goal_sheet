import type { ScheduleSlot, StatusRecordsMap } from '../types';

export const INITIAL_SCHEDULE_SLOTS: ScheduleSlot[] = [
  {
    id: 'slot-1',
    time: '08:00 AM',
    period: 'Morning',
    workGoal: 'DSA Practice',
    goalTitle: 'DSA Practice',
    category: 'Study',
    description: 'Solve 2 LeetCode problems (Array, Trees, DP)',
    order: 1,
  },
  {
    id: 'slot-2',
    time: '09:30 AM',
    period: 'Morning',
    workGoal: 'Mathematics',
    goalTitle: 'Mathematics',
    category: 'Study',
    description: 'Calculus / Linear Algebra deep practice',
    order: 2,
  },
  {
    id: 'slot-3',
    time: '11:30 AM',
    period: 'Morning',
    workGoal: 'Project Work',
    goalTitle: 'Project Work',
    category: 'Development',
    description: 'Full-stack application architecture & coding',
    order: 3,
  },
  {
    id: 'slot-4',
    time: '02:30 PM',
    period: 'Afternoon',
    workGoal: 'System Design',
    goalTitle: 'System Design',
    category: 'Learning',
    description: 'Distributed systems, caching & database sharding',
    order: 4,
  },
  {
    id: 'slot-5',
    time: '05:00 PM',
    period: 'Evening',
    workGoal: 'Workout & Health',
    goalTitle: 'Workout & Health',
    category: 'Health',
    description: 'Gym workout / 5km outdoor run',
    order: 5,
  },
  {
    id: 'slot-6',
    time: '08:00 PM',
    period: 'Evening',
    workGoal: 'Tech Reading',
    goalTitle: 'Tech Reading',
    category: 'Reading',
    description: 'Read 2 engineering blogs or research papers',
    order: 6,
  },
  {
    id: 'slot-7',
    time: '10:00 PM',
    period: 'Night',
    workGoal: 'Daily Review',
    goalTitle: 'Daily Review',
    category: 'Productivity',
    description: 'Log progress, track habits & plan next day',
    order: 7,
  },
];

export function generateInitialStatusRecords(currentYear = 2026): StatusRecordsMap {
  const map: StatusRecordsMap = {};

  // Oct 01
  map[`${currentYear}-10-01_slot-1`] = { status: 'completed' };
  map[`${currentYear}-10-01_slot-2`] = { status: 'completed' };
  map[`${currentYear}-10-01_slot-3`] = { status: 'completed' };
  map[`${currentYear}-10-01_slot-4`] = { status: 'partial' };
  map[`${currentYear}-10-01_slot-5`] = { status: 'completed' };
  map[`${currentYear}-10-01_slot-6`] = { status: 'completed' };
  map[`${currentYear}-10-01_slot-7`] = { status: 'completed' };

  // Oct 02
  map[`${currentYear}-10-02_slot-1`] = { status: 'completed' };
  map[`${currentYear}-10-02_slot-2`] = { status: 'completed' };
  map[`${currentYear}-10-02_slot-3`] = { status: 'partial' };
  map[`${currentYear}-10-02_slot-4`] = { status: 'missed' };
  map[`${currentYear}-10-02_slot-5`] = { status: 'completed' };
  map[`${currentYear}-10-02_slot-6`] = { status: 'partial' };
  map[`${currentYear}-10-02_slot-7`] = { status: 'completed' };

  // Oct 03
  map[`${currentYear}-10-03_slot-1`] = { status: 'completed' };
  map[`${currentYear}-10-03_slot-2`] = { status: 'partial' };
  map[`${currentYear}-10-03_slot-3`] = { status: 'completed' };
  map[`${currentYear}-10-03_slot-4`] = { status: 'completed' };
  map[`${currentYear}-10-03_slot-5`] = { status: 'completed' };
  map[`${currentYear}-10-03_slot-6`] = { status: 'completed' };
  map[`${currentYear}-10-03_slot-7`] = { status: 'completed' };

  // Oct 04
  map[`${currentYear}-10-04_slot-1`] = { status: 'completed' };
  map[`${currentYear}-10-04_slot-2`] = { status: 'missed' };
  map[`${currentYear}-10-04_slot-3`] = { status: 'completed' };
  map[`${currentYear}-10-04_slot-4`] = { status: 'completed' };
  map[`${currentYear}-10-04_slot-5`] = { status: 'partial' };
  map[`${currentYear}-10-04_slot-6`] = { status: 'completed' };
  map[`${currentYear}-10-04_slot-7`] = { status: 'completed' };

  // Oct 05 (Today)
  map[`${currentYear}-10-05_slot-1`] = { status: 'completed' };
  map[`${currentYear}-10-05_slot-2`] = { status: 'completed' };
  map[`${currentYear}-10-05_slot-3`] = { status: 'partial' };
  map[`${currentYear}-10-05_slot-4`] = { status: 'missed' };

  return map;
}
