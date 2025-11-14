import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import eventRoutes from './event.routes';
import statsRoutes from './stats.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/events', eventRoutes);
router.use('/stats', statsRoutes);

export default router;
