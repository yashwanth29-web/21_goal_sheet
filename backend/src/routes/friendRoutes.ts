import { Router } from 'express';
import {
  sendFriendRequest,
  respondFriendRequest,
  getFriendsAndRequests,
  getFriendDetailedTracker,
} from '../controllers/friendController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All friend routes require authentication
router.use(authenticateToken);

router.post('/request', sendFriendRequest);
router.post('/respond', respondFriendRequest);
router.get('/list', getFriendsAndRequests);
router.get('/tracker/:userId', getFriendDetailedTracker);

export default router;
