import { Response, NextFunction } from 'express';
import { EventGeneratorService } from '../services/eventGenerator.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProfileService } from '../services/profile.service';

const eventService = new EventGeneratorService();
const profileService = new ProfileService();

export class EventController {
  /**
   * GET /api/events/today
   */
  async getTodayEvent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await profileService.getProfileByUserId(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found. Please create a profile first.',
        });
        return;
      }

      const event = await eventService.getTodayEvent(profile.id);

      // Kümülatif skoru da döndür
      const updatedProfile = await profileService.getProfile(profile.id);

      res.status(200).json({
        success: true,
        data: {
          event,
          cumulativeScore: updatedProfile?.cumulativeScore,
          currentDay: updatedProfile?.currentDay,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/events/history
   */
  async getEventHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await eventService.getEventHistory(profile.id, page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/events/:id
   */
  async getEventById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const event = await eventService.markEventAsViewed(id);

      res.status(200).json({
        success: true,
        data: { event },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/events/generate (Admin/Test only)
   */
  async generateEvent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const dayNumber = req.body.dayNumber || profile.currentDay + 1;
      const event = await eventService.generateDailyEvent(profile.id, dayNumber);

      res.status(201).json({
        success: true,
        data: { event },
      });
    } catch (error) {
      next(error);
    }
  }
}
