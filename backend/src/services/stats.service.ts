import { ProfileStats, EventType } from '@prisma/client';
import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export interface DashboardStats {
  profile: {
    characterName: string;
    currentDay: number;
    cumulativeScore: number;
    status: string;
  };
  stats: ProfileStats;
  recentTrend: {
    last7Days: number[];
    trendDirection: 'up' | 'down' | 'stable';
  };
  eventDistribution: {
    type: EventType;
    count: number;
    percentage: number;
  }[];
}

export class StatsService {
  /**
   * Dashboard istatistiklerini getir
   */
  async getDashboardStats(profileId: string): Promise<DashboardStats> {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        stats: true,
        events: {
          orderBy: { dayNumber: 'desc' },
          take: 7,
        },
      },
    });

    if (!profile || !profile.stats) {
      throw new NotFoundError('Profile or stats not found');
    }

    // Son 7 günün trend'i
    const last7Days = profile.events.map((e) => e.impactScore).reverse();
    const trendDirection = this.calculateTrend(last7Days);

    // Olay dağılımı
    const eventDistribution = this.calculateEventDistribution(profile.stats);

    return {
      profile: {
        characterName: profile.characterName,
        currentDay: profile.currentDay,
        cumulativeScore: profile.cumulativeScore,
        status: profile.status,
      },
      stats: profile.stats,
      recentTrend: {
        last7Days,
        trendDirection,
      },
      eventDistribution,
    };
  }

  /**
   * Trend yönünü hesaplar
   */
  private calculateTrend(scores: number[]): 'up' | 'down' | 'stable' {
    if (scores.length < 2) return 'stable';

    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const diff = secondAvg - firstAvg;

    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'stable';
  }

  /**
   * Olay dağılımını hesaplar
   */
  private calculateEventDistribution(
    stats: ProfileStats
  ): { type: EventType; count: number; percentage: number }[] {
    const total = stats.totalDays;

    if (total === 0) {
      return [];
    }

    const distribution = [
      { type: 'SUCCESS' as EventType, count: stats.successCount },
      { type: 'FAILURE' as EventType, count: stats.failureCount },
      { type: 'SOCIAL' as EventType, count: stats.socialCount },
      { type: 'FINANCIAL' as EventType, count: stats.financialCount },
      { type: 'INTERNAL' as EventType, count: stats.internalCount },
      { type: 'IDEA' as EventType, count: stats.ideaCount },
      { type: 'CONFLICT' as EventType, count: stats.conflictCount },
    ];

    return distribution.map((item) => ({
      ...item,
      percentage: Math.round((item.count / total) * 100),
    }));
  }

  /**
   * Trend analizi
   */
  async getTrendAnalysis(profileId: string, days: number = 30) {
    const events = await prisma.event.findMany({
      where: { profileId },
      orderBy: { dayNumber: 'desc' },
      take: days,
    });

    if (events.length === 0) {
      return {
        averageImpact: 0,
        positiveRatio: 0,
        mostCommonType: null,
        volatility: 0,
      };
    }

    const impacts = events.map((e) => e.impactScore);
    const averageImpact = impacts.reduce((a, b) => a + b, 0) / impacts.length;

    const positiveCount = impacts.filter((i) => i > 0).length;
    const positiveRatio = (positiveCount / impacts.length) * 100;

    // En yaygın olay tipi
    const typeCounts: Record<string, number> = {};
    events.forEach((e) => {
      typeCounts[e.eventType] = (typeCounts[e.eventType] || 0) + 1;
    });

    const mostCommonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Volatility (standart sapma)
    const variance =
      impacts.reduce((sum, val) => sum + Math.pow(val - averageImpact, 2), 0) / impacts.length;
    const volatility = Math.sqrt(variance);

    return {
      averageImpact: Math.round(averageImpact * 10) / 10,
      positiveRatio: Math.round(positiveRatio),
      mostCommonType,
      volatility: Math.round(volatility * 10) / 10,
    };
  }
}
