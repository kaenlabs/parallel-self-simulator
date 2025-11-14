import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { getEventHistorySchema } from '../validators/event.validator';

const router = Router();
const eventController = new EventController();

// Tüm route'lar auth gerektirir
router.use(authMiddleware);

router.get('/today', (req, res, next) => eventController.getTodayEvent(req, res, next));

router.get('/history', validateRequest(getEventHistorySchema), (req, res, next) =>
  eventController.getEventHistory(req, res, next)
);

router.get('/:id', (req, res, next) => eventController.getEventById(req, res, next));

router.post('/generate', (req, res, next) => eventController.generateEvent(req, res, next));

export default router;
