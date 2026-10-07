import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { createNotificationHelper } from './notificationController.js';


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
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
    });

    // Notify the receiver in their notification inbox
    const senderName = newFriendship.sender?.name || 'Someone';
    await createNotificationHelper(
      targetUserId,
      senderId,
      'FRIEND_REQUEST',
      '📩 Kotta Friend Request Vachindi!',
      `🔥 Rey macha! ${senderName} neeku friend request pampadu! Accept chesi daily accountability modalu pettu! 🎯`,
      { friendshipId: newFriendship.id, senderName }
    );

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
      include: {
        receiver: { select: { id: true, name: true } },
      },
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

    if (action === 'ACCEPT') {
      const accepterName = request.receiver?.name || 'Your friend';
      await createNotificationHelper(
        request.senderId,
        currentUserId,
        'REQUEST_ACCEPTED',
        '🎉 Friend Request Accepted!',
        `🔥 Super bro! ${accepterName} mee friend request accept chesadu! Ippudu iddaru kalisi daily goals track cheskondi! 🏆`,
        { friendshipId: request.id, accepterName }
      );
    }

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
 * Unfriend / Remove or Cancel a friend connection
 */
export async function removeFriend(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;
    const { friendshipId, targetUserId } = req.body;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!friendshipId && !targetUserId) {
      res.status(400).json({ success: false, message: 'Either friendshipId or targetUserId is required' });
      return;
    }

    let friendship = null;
    if (friendshipId) {
      friendship = await (prisma as any).friendship.findUnique({
        where: { id: friendshipId },
      });
    } else if (targetUserId) {
      friendship = await (prisma as any).friendship.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: targetUserId },
            { senderId: targetUserId, receiverId: currentUserId },
          ],
        },
      });
    }

    if (!friendship) {
      res.status(404).json({ success: false, message: 'Friendship connection not found' });
      return;
    }

    // Verify current user is part of the friendship
    if (friendship.senderId !== currentUserId && friendship.receiverId !== currentUserId) {
      res.status(403).json({ success: false, message: 'You are not authorized to modify this friendship' });
      return;
    }

    // Delete the friendship entry so users can reconnect later if desired
    await (prisma as any).friendship.delete({
      where: { id: friendship.id },
    });

    res.status(200).json({
      success: true,
      message: 'Friend removed successfully',
      removedFriendshipId: friendship.id,
    });
  } catch (err: any) {
    console.error('removeFriend error:', err);
    res.status(500).json({ success: false, message: 'Failed to remove friend' });
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
          isAccountabilityPartner: Boolean(f.isAccountabilityPartner),
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
    res.status(500).json({ success: false, message: 'Failed to retrieve friends list' });
  }
}

/**
 * Toggle Accountability Partner status with a friend
 */
export async function toggleAccountabilityPartner(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;
    const { friendshipId, targetUserId, enable } = req.body;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let friendship = null;
    if (friendshipId) {
      friendship = await (prisma as any).friendship.findUnique({
        where: { id: friendshipId },
        include: { sender: true, receiver: true },
      });
    } else if (targetUserId) {
      friendship = await (prisma as any).friendship.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: targetUserId },
            { senderId: targetUserId, receiverId: currentUserId },
          ],
        },
        include: { sender: true, receiver: true },
      });
    }

    if (!friendship || friendship.status !== 'ACCEPTED') {
      res.status(404).json({ success: false, message: 'Active friendship connection not found' });
      return;
    }

    if (friendship.senderId !== currentUserId && friendship.receiverId !== currentUserId) {
      res.status(403).json({ success: false, message: 'Unauthorized to modify this partnership' });
      return;
    }

    const nextState = typeof enable === 'boolean' ? enable : !friendship.isAccountabilityPartner;

    const updated = await (prisma as any).friendship.update({
      where: { id: friendship.id },
      data: {
        isAccountabilityPartner: nextState,
      },
    });

    const partner = friendship.senderId === currentUserId ? friendship.receiver : friendship.sender;
    const partnerUserId = friendship.senderId === currentUserId ? friendship.receiverId : friendship.senderId;
    const myUser = friendship.senderId === currentUserId ? friendship.sender : friendship.receiver;

    if (nextState) {
      await createNotificationHelper(
        partnerUserId,
        currentUserId,
        'ACCOUNTABILITY_PARTNER',
        '🔥 Accountability Partner Connected!',
        `⚡ ${myUser.name} connected you as their live Accountability Partner! Real-time fire notifications are active! 🚀`,
        { friendshipId: friendship.id, partnerName: myUser.name }
      );
    }

    res.status(200).json({
      success: true,
      message: nextState
        ? `🔥 ${partner.name} is now your Accountability Partner! Live fire notifications activated.`
        : `Accountability Partner disabled for ${partner.name}.`,
      isAccountabilityPartner: nextState,
      friendship: updated,
    });

  } catch (err: any) {
    console.error('toggleAccountabilityPartner error:', err);
    res.status(500).json({ success: false, message: 'Failed to toggle accountability partner' });
  }
}

/**

 * Get detailed daily tracker of a friend
 * Enforces permission: Allowed ONLY if self OR accepted friends
 */
export async function getFriendDetailedTracker(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;
    const targetUserId = (req.params.userId || '') as string;
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

/**
 * Search users to add as friends
 */
export async function searchUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;
    const query = (req.query.q as string || '').trim().toLowerCase();

    if (!currentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Find all friendships involving current user
    const friendships = await (prisma as any).friendship.findMany({
      where: {
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      },
    });

    const statusMap = new Map<string, { status: string; requestId: string; isSender: boolean }>();
    friendships.forEach((f: any) => {
      const otherId = f.senderId === currentUserId ? f.receiverId : f.senderId;
      statusMap.set(otherId, {
        status: f.status,
        requestId: f.id,
        isSender: f.senderId === currentUserId,
      });
    });

    // Find matching users (exclude current user)
    const userWhere: any = {
      id: { not: currentUserId },
    };

    if (query.length > 0) {
      userWhere.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ];
    }

    const foundUsers = await prisma.user.findMany({
      where: userWhere,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      take: 25,
      orderBy: { createdAt: 'desc' },
    });

    const results = foundUsers.map((u) => {
      const fInfo = statusMap.get(u.id);
      let relationship: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' = 'NONE';
      let requestId: string | undefined = undefined;

      if (fInfo) {
        requestId = fInfo.requestId;
        if (fInfo.status === 'ACCEPTED') {
          relationship = 'ACCEPTED';
        } else if (fInfo.status === 'PENDING') {
          relationship = fInfo.isSender ? 'PENDING_SENT' : 'PENDING_RECEIVED';
        }
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        relationship,
        requestId,
        joinedAt: u.createdAt.toISOString(),
      };
    });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (err: any) {
    console.error('searchUsers error:', err);
    res.status(500).json({ success: false, message: 'Failed to search users' });
  }
}

/**
 * Toggle Accountability Partner status for a friendship
 */
export async function toggleAccountabilityPartner(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;
    const { friendshipId, targetUserId, enable } = req.body;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let friendship = null;
    if (friendshipId) {
      friendship = await (prisma as any).friendship.findUnique({
        where: { id: friendshipId },
        include: {
          sender: { select: { id: true, name: true } },
          receiver: { select: { id: true, name: true } },
        },
      });
    } else if (targetUserId) {
      friendship = await (prisma as any).friendship.findFirst({
        where: {
          status: 'ACCEPTED',
          OR: [
            { senderId: currentUserId, receiverId: targetUserId },
            { senderId: targetUserId, receiverId: currentUserId },
          ],
        },
        include: {
          sender: { select: { id: true, name: true } },
          receiver: { select: { id: true, name: true } },
        },
      });
    }

    if (!friendship) {
      res.status(404).json({ success: false, message: 'Accepted friendship not found' });
      return;
    }

    const newStatus = typeof enable === 'boolean' ? enable : !friendship.isAccountabilityPartner;

    const updated = await (prisma as any).friendship.update({
      where: { id: friendship.id },
      data: {
        isAccountabilityPartner: newStatus,
      },
    });

    const otherUserId = friendship.senderId === currentUserId ? friendship.receiverId : friendship.senderId;
    const currentUserName = req.user?.name || (friendship.senderId === currentUserId ? friendship.sender?.name : friendship.receiver?.name) || 'Your friend';

    if (newStatus) {
      await createNotificationHelper(
        otherUserId,
        currentUserId,
        'PARTNER_CONNECTED',
        '🔥 Accountability Partner Connected!',
        `💪 ${currentUserName} ninnu accountability partner ga add cheskunadu! Ippudu prati goal, miss & productive work updates instant ga share avtayi! Ready for 100% focus! 🚀`,
        { friendshipId: friendship.id, currentUserName }
      );
    }

    res.status(200).json({
      success: true,
      isAccountabilityPartner: updated.isAccountabilityPartner,
      message: newStatus ? 'Accountability Partner activated! 🔥' : 'Accountability Partner disconnected',
      friendship: updated,
    });
  } catch (err: any) {
    console.error('toggleAccountabilityPartner error:', err);
    res.status(500).json({ success: false, message: 'Failed to update accountability partner status' });
  }
}

/**
 * Poke a friend to motivate / remind them
 */
export async function pokeFriend(req: AuthRequest, res: Response): Promise<void> {
  try {
    const currentUserId = req.user?.id;
    const { targetUserId, title, body } = req.body;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!targetUserId) {
      res.status(400).json({ success: false, message: 'Target user ID is required' });
      return;
    }

    const sender = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { id: true, name: true },
    });

    const senderName = sender?.name || 'Your friend';
    const notifTitle = title || `👉 Poke Alert from ${senderName}!`;
    const notifBody = body || `⚡ ${senderName} just pinged you! Time to hustle and smash your daily goals! 🔥`;

    await createNotificationHelper(
      targetUserId,
      currentUserId,
      'POKE_CHALLENGE',
      notifTitle,
      notifBody,
      { senderName, targetUserId }
    );

    res.status(200).json({
      success: true,
      message: `Poked ${senderName}'s friend successfully! 🚀`,
    });
  } catch (err: any) {
    console.error('pokeFriend error:', err);
    res.status(500).json({ success: false, message: 'Failed to poke friend' });
  }
}

