import { Router } from 'express';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getStatuses,
  updateGoalStatus,
  batchUpdateStatus,
  reorderGoals,
  getCheatDays,
  toggleCheatDay,
} from '../controllers/goalController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All goal routes require JWT authentication
router.use(authenticateToken);

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/reorder', reorderGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

// Status routes
router.get('/statuses', getStatuses);
router.put('/:id/status', updateGoalStatus);
router.post('/batch-status', batchUpdateStatus);

// Cheat Day / Holiday routes
router.get('/cheat-days', getCheatDays);
router.post('/cheat-days/toggle', toggleCheatDay);

export default router;
