import { Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProfileService } from '../services/profile.service';

const statsService = new StatsService();
const profileService = new ProfileService();

export class StatsController {
  /**
   * GET /api/stats/dashboard
   */
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await profileService.getProfileByUserId(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
        return;
      }

      const stats = await statsService.getDashboardStats(profile.id);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/stats/trends
   */
  async getTrends(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await profileService.getProfileByUserId(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
        return;
      }

      const days = parseInt(req.query.days as string) || 30;
      const trends = await statsService.getTrendAnalysis(profile.id, days);

      res.status(200).json({
        success: true,
        data: trends,
      });
    } catch (error) {
      next(error);
    }
  }
}
