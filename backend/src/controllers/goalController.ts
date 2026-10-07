import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { createNotificationHelper } from './notificationController.js';


function parsePeriod(periodStr?: string): 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' {
  if (!periodStr) return 'MORNING';
  const upper = String(periodStr).toUpperCase();
  if (upper === 'AFTERNOON') return 'AFTERNOON';
  if (upper === 'EVENING') return 'EVENING';
  if (upper === 'NIGHT') return 'NIGHT';
  return 'MORNING';
}

function parseStatus(statusStr?: string): 'PENDING' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'MISSED' {
  if (!statusStr) return 'PENDING';
  const upper = String(statusStr).toUpperCase();
  if (upper === 'COMPLETED') return 'COMPLETED';
  if (upper === 'PARTIALLY_COMPLETED' || upper === 'PARTIAL') return 'PARTIALLY_COMPLETED';
  if (upper === 'MISSED') return 'MISSED';
  return 'PENDING';
}

function getIdParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  return String(param || '');
}

// 1. GET /api/goals - Get all goals for authenticated user
export async function getGoals(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { date } = req.query;

    const whereClause: any = { userId };
    if (date && typeof date === 'string') {
      whereClause.OR = [{ date: null }, { date: date }];
    }

    const goals = await prisma.goal.findMany({
      where: whereClause,
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    res.status(200).json({
      success: true,
      goals,
    });
  } catch (err: any) {
    console.error('getGoals error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch goals.' });
  }
}

// 2. POST /api/goals - Create new goal for authenticated user
export async function createGoal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { time, period, workGoal, category, description, date } = req.body;

    if (!workGoal || !String(workGoal).trim()) {
      res.status(400).json({ success: false, message: 'Work goal title is required.' });
      return;
    }

    if (!time || !String(time).trim()) {
      res.status(400).json({ success: false, message: 'Time slot is required.' });
      return;
    }

    const count = await prisma.goal.count({ where: { userId } });

    const newGoal = await prisma.goal.create({
      data: {
        userId,
        time: String(time).trim(),
        period: parsePeriod(period),
        workGoal: String(workGoal).trim(),
        category: category ? String(category).trim() : 'General',
        description: description ? String(description).trim() : null,
        date: date ? String(date).trim() : null,
        order: count + 1,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully!',
      goal: newGoal,
    });
  } catch (err: any) {
    console.error('createGoal error:', err);
    res.status(500).json({ success: false, message: 'Failed to create goal.' });
  }
}

// 3. PUT /api/goals/:id - Update goal with strict ownership verification
export async function updateGoal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = getIdParam(req.params.id);
    const { time, period, workGoal, category, description, date, order } = req.body;

    // Verify ownership
    const existingGoal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existingGoal) {
      res.status(404).json({ success: false, message: 'Goal not found.' });
      return;
    }

    if (existingGoal.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to modify this goal.',
      });
      return;
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        time: time !== undefined ? String(time).trim() : existingGoal.time,
        period: period !== undefined ? parsePeriod(period) : existingGoal.period,
        workGoal: workGoal !== undefined ? String(workGoal).trim() : existingGoal.workGoal,
        category: category !== undefined ? String(category).trim() : existingGoal.category,
        description: description !== undefined ? (description ? String(description).trim() : null) : existingGoal.description,
        date: date !== undefined ? (date ? String(date).trim() : null) : existingGoal.date,
        order: order !== undefined ? Number(order) : existingGoal.order,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully!',
      goal: updated,
    });
  } catch (err: any) {
    console.error('updateGoal error:', err);
    res.status(500).json({ success: false, message: 'Failed to update goal.' });
  }
}

// 4. DELETE /api/goals/:id - Delete goal with strict ownership verification
export async function deleteGoal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = getIdParam(req.params.id);

    // Verify ownership
    const existingGoal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existingGoal) {
      res.status(404).json({ success: false, message: 'Goal not found.' });
      return;
    }

    if (existingGoal.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this goal.',
      });
      return;
    }

    await prisma.goal.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully.',
    });
  } catch (err: any) {
    console.error('deleteGoal error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete goal.' });
  }
}

// 5. GET /api/goals/statuses - Get status records for authenticated user
export async function getStatuses(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { month, date } = req.query;

    const whereClause: any = { userId };
    if (month && typeof month === 'string') {
      whereClause.date = { startsWith: month };
    } else if (date && typeof date === 'string') {
      whereClause.date = date;
    }

    const records = await prisma.dailyStatus.findMany({
      where: whereClause,
    });

    const statusMap: Record<string, { id: string; status: string; note?: string; updatedAt: string }> = {};
    records.forEach((r) => {
      const key = `${r.date}_${r.goalId}`;
      statusMap[key] = {
        id: r.id,
        status: r.status.toLowerCase(),
        note: r.note || undefined,
        updatedAt: r.updatedAt.toISOString(),
      };
    });

    res.status(200).json({
      success: true,
      statuses: statusMap,
      rawList: records,
    });
  } catch (err: any) {
    console.error('getStatuses error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch status records.' });
  }
}

// 6. PUT /api/goals/:id/status - Update or set daily status for a goal
export async function updateGoalStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = getIdParam(req.params.id); // goalId
    const { date, status, note } = req.body;

    if (!date || !String(date).trim()) {
      res.status(400).json({ success: false, message: 'Date (YYYY-MM-DD) is required.' });
      return;
    }

    // Verify goal exists and belongs to user
    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      res.status(404).json({ success: false, message: 'Goal not found.' });
      return;
    }

    if (goal.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot update status for another user\'s goal.',
      });
      return;
    }

    const parsedStatus = parseStatus(status);
    const dateKey = String(date).trim();

    const record = await prisma.dailyStatus.upsert({
      where: {
        goalId_date: {
          goalId: id,
          date: dateKey,
        },
      },
      create: {
        userId,
        goalId: id,
        date: dateKey,
        status: parsedStatus,
        note: note !== undefined ? (note ? String(note).trim() : null) : null,
      },
      update: {
        status: parsedStatus,
        note: note !== undefined ? (note ? String(note).trim() : null) : undefined,
      },
    });

    // Broadcast update to all active Accountability Partners
    try {
      const userRecord = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      const myName = userRecord?.name || 'Your Partner';

      const partnerFriendships = await (prisma as any).friendship.findMany({
        where: {
          OR: [
            { senderId: userId, isAccountabilityPartner: true, status: 'ACCEPTED' },
            { receiverId: userId, isAccountabilityPartner: true, status: 'ACCEPTED' },
          ],
        },
      });

      const noteStr = note ? String(note) : '';
      const isProductiveNote = noteStr.startsWith('[PRODUCTIVE]: ');

      for (const f of partnerFriendships) {
        const partnerId = f.senderId === userId ? f.receiverId : f.senderId;
        if (isProductiveNote) {
          const cleanHustle = noteStr.replace('[PRODUCTIVE]: ', '');
          await createNotificationHelper(
            partnerId,
            userId,
            'PRODUCTIVE_WORK',
            `🌿 ${myName} logged productive unscheduled work!`,
            `"${cleanHustle}" - Zero time wasted! Thaggedhe le! 🔥`,
            { goalTitle: goal.workGoal, time: goal.time }
          );
        } else if (parsedStatus === 'COMPLETED') {
          await createNotificationHelper(
            partnerId,
            userId,
            'GOAL_COMPLETED',
            `🔥 ${myName} completed "${goal.workGoal}"!`,
            `Slot finished on full fire mode! Nuvvu inka target finish cheyaleda macha? 🚀`,
            { goalTitle: goal.workGoal, time: goal.time }
          );
        } else if (parsedStatus === 'MISSED') {
          await createNotificationHelper(
            partnerId,
            userId,
            'GOAL_MISSED',
            `🚨 ${myName} missed "${goal.workGoal}"!`,
            `Call chesi em jarigindo adugu macha! Accountability pressure start chey! 📞`,
            { goalTitle: goal.workGoal, time: goal.time }
          );
        }
      }
    } catch (notifErr) {
      console.warn('Partner notification dispatch error:', notifErr);
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully.',
      record: {
        id: record.id,
        goalId: record.goalId,
        date: record.date,
        status: record.status.toLowerCase(),
        note: record.note,
        updatedAt: record.updatedAt,
      },
    });

  } catch (err: any) {
    console.error('updateGoalStatus error:', err);
    res.status(500).json({ success: false, message: 'Failed to update goal status.' });
  }
}

// 7. POST /api/goals/batch-status - Mark all goals for a date as completed or reset
export async function batchUpdateStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { date, status } = req.body;

    if (!date || !String(date).trim()) {
      res.status(400).json({ success: false, message: 'Date (YYYY-MM-DD) is required.' });
      return;
    }

    const dateKey = String(date).trim();
    const parsedStatus = parseStatus(status);

    const goals = await prisma.goal.findMany({
      where: { userId },
      select: { id: true },
    });

    const operations = goals.map((g) =>
      prisma.dailyStatus.upsert({
        where: {
          goalId_date: {
            goalId: g.id,
            date: dateKey,
          },
        },
        create: {
          userId,
          goalId: g.id,
          date: dateKey,
          status: parsedStatus,
        },
        update: {
          status: parsedStatus,
        },
      })
    );

    await prisma.$transaction(operations);

    res.status(200).json({
      success: true,
      message: `Updated all goals for ${dateKey} to ${status}.`,
    });
  } catch (err: any) {
    console.error('batchUpdateStatus error:', err);
    res.status(500).json({ success: false, message: 'Failed to batch update statuses.' });
  }
}

// 8. POST /api/goals/reorder - Reorder slots
export async function reorderGoals(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { goalIds } = req.body;

    if (!Array.isArray(goalIds)) {
      res.status(400).json({ success: false, message: 'goalIds array is required.' });
      return;
    }

    const updates = goalIds.map((id: string, index: number) =>
      prisma.goal.updateMany({
        where: { id: String(id), userId },
        data: { order: index + 1 },
      })
    );

    await prisma.$transaction(updates);

    res.status(200).json({
      success: true,
      message: 'Goals reordered successfully.',
    });
  } catch (err: any) {
    console.error('reorderGoals error:', err);
    res.status(500).json({ success: false, message: 'Failed to reorder goals.' });
  }
}

// 9. GET /api/goals/cheat-days - Get cheat / holiday days for authenticated user
export async function getCheatDays(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { month } = req.query;

    const whereClause: any = { userId };
    if (month && typeof month === 'string') {
      whereClause.date = { startsWith: month };
    }

    let records: any[] = [];
    try {
      if ((prisma as any).cheatDay) {
        records = await (prisma as any).cheatDay.findMany({
          where: whereClause,
          select: { date: true, reason: true },
        });
      }
    } catch (e) {
      console.warn('CheatDay model query notice:', e);
    }

    const cheatDates = records.map((r) => r.date);

    res.status(200).json({
      success: true,
      cheatDays: cheatDates,
      records,
    });
  } catch (err: any) {
    console.error('getCheatDays error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch cheat days.' });
  }
}

// 10. POST /api/goals/cheat-days/toggle - Toggle or set a date as cheat day
export async function toggleCheatDay(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { date, isCheatDay, reason } = req.body;

    if (!date || !String(date).trim()) {
      res.status(400).json({ success: false, message: 'Date (YYYY-MM-DD) is required.' });
      return;
    }

    const dateKey = String(date).trim();
    let finalState = false;

    try {
      if ((prisma as any).cheatDay) {
        const existing = await (prisma as any).cheatDay.findUnique({
          where: {
            userId_date: {
              userId,
              date: dateKey,
            },
          },
        });

        if (isCheatDay === undefined) {
          if (existing) {
            await (prisma as any).cheatDay.delete({
              where: { id: existing.id },
            });
            finalState = false;
          } else {
            await (prisma as any).cheatDay.create({
              data: {
                userId,
                date: dateKey,
                reason: reason || 'Holiday / Cheat Day',
              },
            });
            finalState = true;
          }
        } else if (isCheatDay) {
          if (!existing) {
            await (prisma as any).cheatDay.create({
              data: {
                userId,
                date: dateKey,
                reason: reason || 'Holiday / Cheat Day',
              },
            });
          }
          finalState = true;
        } else {
          if (existing) {
            await (prisma as any).cheatDay.delete({
              where: { id: existing.id },
            });
          }
          finalState = false;
        }
      } else {
        finalState = Boolean(isCheatDay);
      }
    } catch (dbErr) {
      console.warn('CheatDay DB operation fallback:', dbErr);
      finalState = isCheatDay !== undefined ? Boolean(isCheatDay) : true;
    }

    res.status(200).json({
      success: true,
      isCheatDay: finalState,
      date: dateKey,
      message: finalState ? `Marked ${dateKey} as Cheat Day / Holiday.` : `Removed ${dateKey} from Cheat Days.`,
    });
  } catch (err: any) {
    console.error('toggleCheatDay error:', err);
    res.status(500).json({ success: false, message: 'Failed to toggle cheat day.' });
  }
}

