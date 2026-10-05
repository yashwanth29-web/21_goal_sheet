import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Leaderboard requires authentication
router.use(authenticateToken);

router.get('/', getLeaderboard);

export default router;
