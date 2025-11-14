import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { createProfileSchema, updateProfileSchema } from '../validators/profile.validator';

const router = Router();
const profileController = new ProfileController();

// Tüm route'lar auth gerektirir
router.use(authMiddleware);

router.post('/', validateRequest(createProfileSchema), (req, res, next) =>
  profileController.createProfile(req, res, next)
);

router.get('/', (req, res, next) => profileController.getMyProfile(req, res, next));

router.get('/:id', (req, res, next) => profileController.getProfile(req, res, next));

router.put('/:id', validateRequest(updateProfileSchema), (req, res, next) =>
  profileController.updateProfile(req, res, next)
);

router.delete('/:id', (req, res, next) => profileController.deleteProfile(req, res, next));

router.post('/:id/pause', (req, res, next) => profileController.pauseProfile(req, res, next));

router.post('/:id/resume', (req, res, next) => profileController.resumeProfile(req, res, next));

export default router;
