import { z } from 'zod';

export const createProfileSchema = z.object({
  body: z.object({
    characterName: z.string().min(2, 'Character name must be at least 2 characters').max(50),
    mainTrait: z.string().min(2).max(30),
    weakness: z.string().min(2).max(30),
    talent: z.string().min(2).max(30),
    dailyGoal: z.string().min(5).max(200),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    characterName: z.string().min(2).max(50).optional(),
    mainTrait: z.string().min(2).max(30).optional(),
    weakness: z.string().min(2).max(30).optional(),
    talent: z.string().min(2).max(30).optional(),
    dailyGoal: z.string().min(5).max(200).optional(),
    status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED']).optional(),
  }),
});
