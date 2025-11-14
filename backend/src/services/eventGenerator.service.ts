import { Profile, Event, EventType } from '@prisma/client';
import prisma from '../config/database';
import { DeterministicEngine } from './deterministicEngine.service';
import { EVENT_TEMPLATES } from '../data/eventTemplates';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class EventGeneratorService {
  /**
   * Belirli bir profil ve gün için olay üretir
   */
  async generateDailyEvent(profileId: string, dayNumber?: number): Promise<Event> {
    // Profili getir
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    // Gün numarasını belirle
    const day = dayNumber !== undefined ? dayNumber : profile.currentDay + 1;

    // Olay zaten üretilmiş mi kontrol et
    const existingEvent = await prisma.event.findUnique({
      where: {
        profileId_dayNumber: {
          profileId,
          dayNumber: day,
        },
      },
    });

    if (existingEvent) {
      logger.info(`Event already exists for profile ${profileId}, day ${day}`);
      return existingEvent;
    }

    // Deterministik olay üret
    const event = await this.createEvent(profile, day);

    // Profil durumunu güncelle
    await this.updateProfileState(profile, event);

    logger.info(`Generated event for profile ${profileId}, day ${day}: ${event.title}`);

    return event;
  }

  /**
   * Deterministik olayı oluşturur
   */
  private async createEvent(profile: Profile, dayNumber: number): Promise<Event> {
    // 1. Olay tipini belirle
    const eventType = DeterministicEngine.determineEventType(profile.seed, dayNumber);

    // 2. Yoğunluğu hesapla
    const intensity = DeterministicEngine.calculateIntensity(profile, dayNumber, eventType);

    // 3. Uygun şablonları filtrele
    const matchingTemplates = EVENT_TEMPLATES.filter(
      (t) =>
        t.eventType === eventType &&
        intensity >= t.intensityMin &&
        intensity <= t.intensityMax
    );

    if (matchingTemplates.length === 0) {
      throw new Error(`No template found for ${eventType} with intensity ${intensity}`);
    }

    // 4. Şablonu seç
    const templateIndex = DeterministicEngine.selectTemplateIndex(
      profile.seed,
      dayNumber,
      matchingTemplates.length
    );
    const template = matchingTemplates[templateIndex];

    // 5. Etki puanını hesapla
    const impactScore = DeterministicEngine.calculateImpact(profile, eventType, intensity);

    // 6. Kategoriyi belirle
    const category = DeterministicEngine.determineCategory(impactScore);

    // 7. Açıklamayı doldur
    const description = DeterministicEngine.fillTemplate(template.descriptionTemplate, profile);

    // 8. Detay JSON'ı oluştur
    const detailsJson = {
      templateId: template.title,
      tags: template.tags,
      aiReadyData: {
        context: `Day ${dayNumber} for ${profile.characterName}`,
        mood: category.toLowerCase(),
        previousScore: profile.cumulativeScore,
      },
    };

    // 9. Olayı veritabanına kaydet
    const event = await prisma.event.create({
      data: {
        profileId: profile.id,
        dayNumber,
        eventType,
        category,
        title: template.title,
        description,
        intensity,
        impactScore,
        detailsJson,
      },
    });

    return event;
  }

  /**
   * Profil durumunu günceller
   */
  private async updateProfileState(profile: Profile, event: Event): Promise<void> {
    const newScore = profile.cumulativeScore + event.impactScore;

    // Profili güncelle
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        currentDay: event.dayNumber,
        cumulativeScore: newScore,
      },
    });

    // İstatistikleri güncelle
    await this.updateStats(profile.id, event);
  }

  /**
   * Profil istatistiklerini günceller
   */
  private async updateStats(profileId: string, event: Event): Promise<void> {
    const stats = await prisma.profileStats.findUnique({
      where: { profileId },
    });

    if (!stats) {
      // İlk olay, yeni stats oluştur
      await prisma.profileStats.create({
        data: {
          profileId,
          totalDays: 1,
          successCount: event.eventType === 'SUCCESS' ? 1 : 0,
          failureCount: event.eventType === 'FAILURE' ? 1 : 0,
          socialCount: event.eventType === 'SOCIAL' ? 1 : 0,
          financialCount: event.eventType === 'FINANCIAL' ? 1 : 0,
          internalCount: event.eventType === 'INTERNAL' ? 1 : 0,
          ideaCount: event.eventType === 'IDEA' ? 1 : 0,
          conflictCount: event.eventType === 'CONFLICT' ? 1 : 0,
          averageImpact: event.impactScore,
          currentStreak: event.impactScore > 0 ? 1 : 0,
          longestStreak: event.impactScore > 0 ? 1 : 0,
        },
      });
      return;
    }

    // Mevcut stats'ı güncelle
    const totalDays = stats.totalDays + 1;
    const totalImpact =
      stats.averageImpact * stats.totalDays + event.impactScore;
    const newAverageImpact = totalImpact / totalDays;

    // Streak hesaplama
    let currentStreak = stats.currentStreak;
    let longestStreak = stats.longestStreak;

    if (event.impactScore > 0) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (event.impactScore < -30) {
      currentStreak = 0;
    }

    await prisma.profileStats.update({
      where: { profileId },
      data: {
        totalDays,
        successCount: stats.successCount + (event.eventType === 'SUCCESS' ? 1 : 0),
        failureCount: stats.failureCount + (event.eventType === 'FAILURE' ? 1 : 0),
        socialCount: stats.socialCount + (event.eventType === 'SOCIAL' ? 1 : 0),
        financialCount: stats.financialCount + (event.eventType === 'FINANCIAL' ? 1 : 0),
        internalCount: stats.internalCount + (event.eventType === 'INTERNAL' ? 1 : 0),
        ideaCount: stats.ideaCount + (event.eventType === 'IDEA' ? 1 : 0),
        conflictCount: stats.conflictCount + (event.eventType === 'CONFLICT' ? 1 : 0),
        averageImpact: newAverageImpact,
        currentStreak,
        longestStreak,
      },
    });
  }

  /**
   * Bugünün olayını getirir (veya üretir)
   */
  async getTodayEvent(profileId: string): Promise<Event> {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const targetDay = profile.currentDay + 1;

    // Olay zaten var mı?
    let event = await prisma.event.findUnique({
      where: {
        profileId_dayNumber: {
          profileId,
          dayNumber: targetDay,
        },
      },
    });

    // Yoksa üret
    if (!event) {
      event = await this.generateDailyEvent(profileId, targetDay);
    }

    return event;
  }

  /**
   * Olay geçmişini getirir
   */
  async getEventHistory(
    profileId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ events: Event[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { profileId },
        orderBy: { dayNumber: 'desc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where: { profileId } }),
    ]);

    const pages = Math.ceil(total / limit);

    return { events, total, pages };
  }

  /**
   * Olayı görüntülenmiş olarak işaretle
   */
  async markEventAsViewed(eventId: string): Promise<Event> {
    return prisma.event.update({
      where: { id: eventId },
      data: { viewedAt: new Date() },
    });
  }
}
