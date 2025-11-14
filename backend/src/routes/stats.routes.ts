import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const statsController = new StatsController();

// Tüm route'lar auth gerektirir
router.use(authMiddleware);

router.get('/dashboard', (req, res, next) => statsController.getDashboard(req, res, next));

router.get('/trends', (req, res, next) => statsController.getTrends(req, res, next));

export default router;
