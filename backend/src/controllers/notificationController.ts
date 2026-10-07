import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

/**
 * Get notifications for the authenticated user
 */
export async function getNotifications(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const unreadOnly = req.query.unread === 'true';

    const whereClause: any = { userId };
    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const notifications = await (prisma as any).appNotification.findMany({
      where: whereClause,
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await (prisma as any).appNotification.count({
      where: { userId, isRead: false },
    });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (err: any) {
    console.error('getNotifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
}

/**
 * Mark notification(s) as read
 */
export async function markAsRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { notificationIds, markAll } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (markAll) {
      await (prisma as any).appNotification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    } else if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      await (prisma as any).appNotification.updateMany({
        where: {
          id: { in: notificationIds },
          userId,
        },
        data: { isRead: true },
      });
    }

    res.status(200).json({ success: true, message: 'Notifications marked as read' });
  } catch (err: any) {
    console.error('markAsRead error:', err);
    res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
}

/**
 * Helper to dispatch an in-app & push notification in PostgreSQL
 */
export async function createNotificationHelper(
  userId: string,
  senderId: string | null,
  type: string,
  title: string,
  message: string,
  metadata?: any
): Promise<any> {
  try {
    return await (prisma as any).appNotification.create({
      data: {
        userId,
        senderId,
        type,
        title,
        message,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        isRead: false,
      },
    });
  } catch (err) {
    console.warn('Failed to create notification helper record:', err);
    return null;
  }
}
