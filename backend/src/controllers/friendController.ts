import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

/**
 * Send a friend request to another user
 */
export async function sendFriendRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const senderId = req.user?.id;
    const { receiverId, receiverEmail } = req.body;

    if (!senderId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let targetUserId = receiverId;

    if (!targetUserId && receiverEmail) {
      const targetUser = await prisma.user.findUnique({
        where: { email: receiverEmail.toLowerCase().trim() },
        select: { id: true },
      });
      if (!targetUser) {
        res.status(404).json({ success: false, message: 'User not found with this email' });
        return;
      }
      targetUserId = targetUser.id;
    }

    if (!targetUserId) {
      res.status(400).json({ success: false, message: 'Receiver ID or email is required' });
      return;
    }

    if (senderId === targetUserId) {
      res.status(400).json({ success: false, message: 'You cannot send a friend request to yourself' });
      return;
    }

    // Check if friendship or request already exists (in either direction)
    const existing = await (prisma as any).friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        res.status(200).json({ success: true, message: 'You are already friends', friendship: existing });
        return;
      }
      if (existing.status === 'PENDING') {
        if (existing.senderId === senderId) {
          res.status(200).json({ success: true, message: 'Friend request already sent', friendship: existing });
          return;
        } else {
          // The other user already sent a request to me, so auto-accept!
          const accepted = await (prisma as any).friendship.update({
            where: { id: existing.id },
            data: { status: 'ACCEPTED' },
          });
          res.status(200).json({ success: true, message: 'Mutual request detected! You are now friends.', friendship: accepted });
          return;
        }
      }
      // If REJECTED, allow re-requesting
      const renewed = await (prisma as any).friendship.update({
        where: { id: existing.id },
        data: {
          senderId,
          receiverId: targetUserId,
          status: 'PENDING',
        },
      });
      res.status(200).json({ success: true, message: 'Friend request sent successfully', friendship: renewed });
      return;
    }

    // Create new friend request
    const newFriendship = await (prisma as any).friendship.create({
      data: {
        senderId,
        receiverId: targetUserId,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      friendship: newFriendship,
    });
  } catch (err: any) {
    console.error('sendFriendRequest error:', err);
    res.status(500).json({ success: false, message: 'Failed to send friend request' });
  }
}

/**
 * Accept or Reject a friend request
 */
export async function respondFriendRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;
    const { requestId, action } = req.body; // action: 'ACCEPT' | 'REJECT'

    if (!currentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!requestId || !action || (action !== 'ACCEPT' && action !== 'REJECT')) {
      res.status(400).json({ success: false, message: 'Valid requestId and action (ACCEPT or REJECT) required' });
      return;
    }

    const request = await (prisma as any).friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      res.status(404).json({ success: false, message: 'Friend request not found' });
      return;
    }

    if (request.receiverId !== currentUserId) {
      res.status(403).json({ success: false, message: 'You are not authorized to respond to this request' });
      return;
    }

    const updated = await (prisma as any).friendship.update({
      where: { id: requestId },
      data: {
        status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED',
      },
    });

    res.status(200).json({
      success: true,
      message: action === 'ACCEPT' ? 'Friend request accepted!' : 'Friend request declined',
      friendship: updated,
    });
  } catch (err: any) {
    console.error('respondFriendRequest error:', err);
    res.status(500).json({ success: false, message: 'Failed to respond to friend request' });
  }
}

/**
 * Get all friends and pending incoming/outgoing requests
 */
export async function getFriendsAndRequests(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Fetch all friendships involving the user
    const allFriendships = await (prisma as any).friendship.findMany({
      where: {
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
        receiver: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const friends: any[] = [];
    const incomingRequests: any[] = [];
    const outgoingRequests: any[] = [];

    allFriendships.forEach((f: any) => {
      if (f.status === 'ACCEPTED') {
        const friendUser = f.senderId === currentUserId ? f.receiver : f.sender;
        friends.push({
          friendshipId: f.id,
          friend: friendUser,
          connectedAt: f.updatedAt,
        });
      } else if (f.status === 'PENDING') {
        if (f.receiverId === currentUserId) {
          incomingRequests.push({
            requestId: f.id,
            from: f.sender,
            requestedAt: f.createdAt,
          });
        } else if (f.senderId === currentUserId) {
          outgoingRequests.push({
            requestId: f.id,
            to: f.receiver,
            requestedAt: f.createdAt,
          });
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        friends,
        incomingRequests,
        outgoingRequests,
        totalFriends: friends.length,
        pendingIncomingCount: incomingRequests.length,
      },
    });
  } catch (err: any) {
    console.error('getFriendsAndRequests error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch friends & requests' });
  }
}

/**
 * Get detailed daily tracker of a friend
 * Enforces permission: Allowed ONLY if self OR accepted friends
 */
export async function getFriendDetailedTracker(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;
    const targetUserId = req.params.userId;
    const month = req.query.month as string; // Optional "YYYY-MM"

    if (!currentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!targetUserId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    // Check friendship access
    const isSelf = currentUserId === targetUserId;
    let isFriend = false;

    if (!isSelf) {
      const friendship = await (prisma as any).friendship.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: targetUserId, status: 'ACCEPTED' },
            { senderId: targetUserId, receiverId: currentUserId, status: 'ACCEPTED' },
          ],
        },
      });
      isFriend = Boolean(friendship);
    }

    if (!isSelf && !isFriend) {
      res.status(403).json({
        success: false,
        isLocked: true,
        message: '🔒 This user’s detailed daily goal tracker is private. Send a friend request to view their daily progress.',
      });
      return;
    }

    // Fetch friend details
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Fetch friend's goals
    const goals = await prisma.goal.findMany({
      where: { userId: targetUserId },
      orderBy: { order: 'asc' },
    });

    // Fetch friend's daily statuses (optional filter by month prefix)
    const statusWhere: any = { userId: targetUserId };
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      statusWhere.date = { startsWith: month };
    }

    const dailyStatuses = await prisma.dailyStatus.findMany({
      where: statusWhere,
      orderBy: { date: 'desc' },
    });

    // Fetch friend's cheat days
    const cheatDays = await prisma.cheatDay.findMany({
      where: { userId: targetUserId },
      select: { date: true, reason: true },
    });

    res.status(200).json({
      success: true,
      isLocked: false,
      data: {
        user: targetUser,
        goals,
        dailyStatuses,
        cheatDays,
      },
    });
  } catch (err: any) {
    console.error('getFriendDetailedTracker error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch friend tracker' });
  }
}
