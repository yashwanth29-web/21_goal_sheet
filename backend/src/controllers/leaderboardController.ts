import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getLeaderboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayKey = `${year}-${month}-${day}`;
    const monthPrefix = `${year}-${month}`;

    // Fetch all users with their goals and daily statuses
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        goals: {
          select: {
            id: true,
            workGoal: true,
            period: true,
          },
        },
        dailyStatuses: {
          select: {
            id: true,
            goalId: true,
            date: true,
            status: true,
            updatedAt: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    const leaderboard = users.map((u) => {
      const totalGoalsCount = u.goals.length;

      // Daily statuses for today
      const todayStatuses = u.dailyStatuses.filter((s) => s.date === todayKey);
      const todayCompleted = todayStatuses.filter((s) => s.status === 'COMPLETED').length;
      const todayPartial = todayStatuses.filter((s) => s.status === 'PARTIALLY_COMPLETED').length;
      const todayMissed = todayStatuses.filter((s) => s.status === 'MISSED').length;
      const todayTracked = todayCompleted + todayPartial + todayMissed;

      // Calculate today achievement rate:
      // If user has goals set, compare completed goals against totalGoals (or tracked if larger)
      const todayDenominator = totalGoalsCount > 0 ? totalGoalsCount : Math.max(todayTracked, 1);
      const todayRate = (totalGoalsCount > 0 || todayTracked > 0)
        ? Math.min(100, Math.round(((todayCompleted + todayPartial * 0.5) / todayDenominator) * 100))
        : 0;

      // Daily statuses for this month
      const monthStatuses = u.dailyStatuses.filter((s) => s.date.startsWith(monthPrefix));
      const monthCompleted = monthStatuses.filter((s) => s.status === 'COMPLETED').length;
      const monthPartial = monthStatuses.filter((s) => s.status === 'PARTIALLY_COMPLETED').length;
      const monthMissed = monthStatuses.filter((s) => s.status === 'MISSED').length;
      const monthTracked = monthCompleted + monthPartial + monthMissed;

      const monthRate = monthTracked > 0
        ? Math.min(100, Math.round(((monthCompleted + monthPartial * 0.5) / monthTracked) * 100))
        : 0;

      // All-time completed count
      const allTimeCompleted = u.dailyStatuses.filter((s) => s.status === 'COMPLETED').length;

      // Calculate Current Streak & Best Streak
      const datesWithCompletion = new Set<string>();
      u.dailyStatuses.forEach((s) => {
        if (s.status === 'COMPLETED' || s.status === 'PARTIALLY_COMPLETED') {
          datesWithCompletion.add(s.date);
        }
      });

      // Calculate current streak
      let currentStreak = 0;
      let dateCursor = new Date(year, now.getMonth(), now.getDate());

      // If today hasn't had completions yet, check yesterday so streak is not lost mid-day
      if (!datesWithCompletion.has(todayKey)) {
        dateCursor.setDate(dateCursor.getDate() - 1);
      }

      for (let i = 0; i < 365; i++) {
        const y = dateCursor.getFullYear();
        const m = String(dateCursor.getMonth() + 1).padStart(2, '0');
        const d = String(dateCursor.getDate()).padStart(2, '0');
        const dKey = `${y}-${m}-${d}`;

        if (datesWithCompletion.has(dKey)) {
          currentStreak++;
          dateCursor.setDate(dateCursor.getDate() - 1);
        } else {
          break;
        }
      }

      // Best streak calculation across all recorded history
      const sortedDates = Array.from(datesWithCompletion).sort();
      let bestStreak = 0;
      let tempStreak = 0;
      let prevDateObj: Date | null = null;

      for (const dStr of sortedDates) {
        const [dy, dm, dd] = dStr.split('-').map(Number);
        const curDateObj = new Date(dy, dm - 1, dd);
        if (!prevDateObj) {
          tempStreak = 1;
        } else {
          const diffDays = Math.round((curDateObj.getTime() - prevDateObj.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            tempStreak = 1;
          }
        }
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
        prevDateObj = curDateObj;
      }
      bestStreak = Math.max(bestStreak, currentStreak);

      // Last activity timestamp
      let lastActiveAt = u.createdAt.toISOString();
      if (u.dailyStatuses.length > 0 && u.dailyStatuses[0].updatedAt) {
        lastActiveAt = u.dailyStatuses[0].updatedAt.toISOString();
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        isCurrentUser: u.id === currentUserId,
        totalGoals: totalGoalsCount,
        today: {
          rate: todayRate,
          completed: todayCompleted,
          partial: todayPartial,
          missed: todayMissed,
          tracked: todayTracked,
          total: totalGoalsCount,
        },
        monthly: {
          rate: monthRate,
          completed: monthCompleted,
          partial: monthPartial,
          missed: monthMissed,
          tracked: monthTracked,
        },
        streak: {
          current: currentStreak,
          best: bestStreak,
          isActiveToday: datesWithCompletion.has(todayKey),
        },
        allTimeCompleted,
        lastActiveAt,
        joinedAt: u.createdAt.toISOString(),
      };
    });

    // Default sort: highest monthly rate, then today rate, then current streak
    leaderboard.sort((a, b) => {
      if (b.monthly.rate !== a.monthly.rate) return b.monthly.rate - a.monthly.rate;
      if (b.today.rate !== a.today.rate) return b.today.rate - a.today.rate;
      if (b.streak.current !== a.streak.current) return b.streak.current - a.streak.current;
      return b.allTimeCompleted - a.allTimeCompleted;
    });

    res.status(200).json({
      success: true,
      data: leaderboard,
      todayKey,
      monthKey: monthPrefix,
      totalUsers: leaderboard.length,
    });
  } catch (err: any) {
    console.error('getLeaderboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch live leaderboard.' });
  }
}
