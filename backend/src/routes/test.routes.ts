import { Router } from 'express';
import { DeterministicEngine } from '../services/deterministicEngine.service';
import { generateProfileSeed } from '../utils/crypto.utils';
import { EVENT_TEMPLATES } from '../data/eventTemplates';

const router = Router();

/**
 * Test endpoint: Seed generation
 */
router.post('/generate-seed', async (req, res) => {
  try {
    const { characterName, mainTrait, weakness, talent, dailyGoal } = req.body;
    
    const seed = generateProfileSeed(
      mainTrait,
      weakness,
      talent,
      dailyGoal,
      characterName
    );

    res.json({
      success: true,
      seed,
      input: { characterName, mainTrait, weakness, talent, dailyGoal },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Test endpoint: Single event generation
 */
router.post('/generate-event', async (req, res) => {
  try {
    const { characterName, mainTrait, weakness, talent, dailyGoal, dayNumber = 1 } = req.body;
    
    const seed = generateProfileSeed(
      mainTrait,
      weakness,
      talent,
      dailyGoal,
      characterName
    );

    const mockProfile: any = {
      id: 'test',
      seed,
      characterName,
      mainTrait,
      weakness,
      talent,
      dailyGoal,
      currentDay: dayNumber,
      cumulativeScore: 0,
    };

    const eventType = DeterministicEngine.determineEventType(seed, dayNumber);
    const intensity = DeterministicEngine.calculateIntensity(mockProfile, dayNumber, eventType);
    const impactScore = DeterministicEngine.calculateImpact(mockProfile, eventType, intensity);
    const event = {
      eventType,
      intensity,
      impactScore,
      dayNumber,
      title: `Test Event - ${eventType}`,
      description: `Generated for ${characterName} on day ${dayNumber}`,
    };

    res.json({
      success: true,
      seed,
      event,
      profile: {
        characterName,
        mainTrait,
        weakness,
        talent,
        dailyGoal,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Test endpoint: Multiple events generation
 */
router.post('/generate-multiple-events', async (req, res) => {
  try {
    const { characterName, mainTrait, weakness, talent, dailyGoal, days = 7 } = req.body;
    
    const seed = generateProfileSeed(
      mainTrait,
      weakness,
      talent,
      dailyGoal,
      characterName
    );

    const mockProfile: any = {
      id: 'test',
      seed,
      characterName,
      mainTrait,
      weakness,
      talent,
      dailyGoal,
      currentDay: 0,
      cumulativeScore: 0,
    };

    const events = [];
    let cumulativeScore = 0;

    for (let day = 1; day <= days; day++) {
      const eventType = DeterministicEngine.determineEventType(seed, day);
      const intensity = DeterministicEngine.calculateIntensity(mockProfile, day, eventType);
      const impactScore = DeterministicEngine.calculateImpact(mockProfile, eventType, intensity);
      cumulativeScore += impactScore;
      events.push({
        eventType,
        intensity,
        impactScore,
        dayNumber: day,
        title: `Test Event - ${eventType}`,
        description: `Generated for ${characterName} on day ${day}`,
      });
    }

    res.json({
      success: true,
      seed,
      events,
      summary: {
        totalDays: days,
        totalImpact: cumulativeScore,
        averageImpact: Math.round((cumulativeScore / days) * 10) / 10,
      },
      profile: {
        characterName,
        mainTrait,
        weakness,
        talent,
        dailyGoal,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Test endpoint: Event templates count
 */
router.get('/templates-info', (_req, res) => {
  const typeCount: Record<string, number> = {};
  
  EVENT_TEMPLATES.forEach((template) => {
    typeCount[template.eventType] = (typeCount[template.eventType] || 0) + 1;
  });

  res.json({
    success: true,
    totalTemplates: EVENT_TEMPLATES.length,
    byType: typeCount,
  });
});

export default router;
