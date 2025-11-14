export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  characterName: string;
  mainTrait: string;
  weakness: string;
  talent: string;
  dailyGoal: string;
  seed: string;
  startDate: string;
  currentDay: number;
  cumulativeScore: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface ProfileWithStats extends Profile {
  stats: ProfileStats;
}

export interface ProfileStats {
  id: string;
  profileId: string;
  totalDays: number;
  successCount: number;
  failureCount: number;
  socialCount: number;
  financialCount: number;
  internalCount: number;
  ideaCount: number;
  conflictCount: number;
  averageImpact: number;
  currentStreak: number;
  longestStreak: number;
  updatedAt: string;
}

export interface Event {
  id: string;
  profileId: string;
  dayNumber: number;
  eventType: EventType;
  category: EventCategory;
  title: string;
  description: string;
  intensity: number;
  impactScore: number;
  detailsJson?: any;
  generatedAt: string;
  viewedAt?: string;
}

export type EventType = 'SUCCESS' | 'FAILURE' | 'SOCIAL' | 'FINANCIAL' | 'INTERNAL' | 'IDEA' | 'CONFLICT';
export type EventCategory = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

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

export interface TrendAnalysis {
  averageImpact: number;
  positiveRatio: number;
  mostCommonType: string | null;
  volatility: number;
}
