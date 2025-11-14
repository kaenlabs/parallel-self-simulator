import cron from 'node-cron';
import { EventGeneratorService } from '../services/eventGenerator.service';
import { ProfileService } from '../services/profile.service';
import logger from '../utils/logger';

const eventService = new EventGeneratorService();
const profileService = new ProfileService();

export class EventScheduler {
  /**
   * Scheduler'ı başlatır
   */
  start(): void {
    // Her gün saat 00:00'da çalış (UTC)
    cron.schedule('0 0 * * *', async () => {
      logger.info('Daily event generation started');
      await this.generateAllEvents();
    });

    logger.info('Event scheduler initialized - runs daily at 00:00 UTC');

    // Test için: Her dakika çalışan versiyon (geliştirme için)
    if (process.env.NODE_ENV === 'development') {
      logger.info('Development mode: Also running every 5 minutes for testing');
      // cron.schedule('*/5 * * * *', async () => {
      //   logger.info('Test event generation started');
      //   await this.generateAllEvents();
      // });
    }
  }

  /**
   * Tüm aktif profiller için olay üretir
   */
  private async generateAllEvents(): Promise<void> {
    try {
      const activeProfiles = await profileService.getActiveProfiles();
      logger.info(`Found ${activeProfiles.length} active profiles`);

      let successCount = 0;
      let errorCount = 0;

      for (const profile of activeProfiles) {
        try {
          await eventService.generateDailyEvent(profile.id);
          successCount++;
          logger.debug(`Event generated for profile ${profile.id}`);
        } catch (error) {
          errorCount++;
          logger.error(`Failed to generate event for profile ${profile.id}:`, error);
        }
      }

      logger.info(
        `Daily event generation completed. Success: ${successCount}, Errors: ${errorCount}`
      );
    } catch (error) {
      logger.error('Daily event generation failed:', error);
    }
  }

  /**
   * Manuel olarak tüm olayları üretir (test için)
   */
  async generateAllEventsNow(): Promise<void> {
    logger.info('Manual event generation triggered');
    await this.generateAllEvents();
  }
}
