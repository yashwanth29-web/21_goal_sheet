import { Router } from 'express';
import {
  sendFriendRequest,
  respondFriendRequest,
  getFriendsAndRequests,
  getFriendDetailedTracker,
  searchUsers,
  removeFriend,
} from '../controllers/friendController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All friend routes require authentication
router.use(authenticateToken);

router.get('/search', searchUsers);
router.post('/request', sendFriendRequest);
router.post('/respond', respondFriendRequest);
router.post('/remove', removeFriend);
router.get('/list', getFriendsAndRequests);
router.get('/tracker/:userId', getFriendDetailedTracker);

export default router;

