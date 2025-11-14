import { apiClient } from './client';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { Profile, ProfileWithStats, Event, DashboardStats, TrendAnalysis } from '@/types';

export interface CreateProfileInput {
  characterName: string;
  mainTrait: string;
  weakness: string;
  talent: string;
  dailyGoal: string;
}

export interface UpdateProfileInput {
  characterName?: string;
  mainTrait?: string;
  weakness?: string;
  talent?: string;
  dailyGoal?: string;
  status?: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export const profileApi = {
  create: async (data: CreateProfileInput): Promise<ApiResponse<{ profile: Profile }>> => {
    return apiClient.post('/profile', data);
  },

  getMyProfile: async (): Promise<ApiResponse<{ profile: Profile }>> => {
    return apiClient.get('/profile');
  },

  getById: async (id: string): Promise<ApiResponse<{ profile: ProfileWithStats }>> => {
    return apiClient.get(`/profile/${id}`);
  },

  update: async (id: string, data: UpdateProfileInput): Promise<ApiResponse<{ profile: Profile }>> => {
    return apiClient.put(`/profile/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/profile/${id}`);
  },

  pause: async (id: string): Promise<ApiResponse<{ profile: Profile }>> => {
    return apiClient.post(`/profile/${id}/pause`);
  },

  resume: async (id: string): Promise<ApiResponse<{ profile: Profile }>> => {
    return apiClient.post(`/profile/${id}/resume`);
  },
};

export const eventsApi = {
  getToday: async (): Promise<
    ApiResponse<{
      event: Event;
      cumulativeScore: number;
      currentDay: number;
    }>
  > => {
    return apiClient.get('/events/today');
  },

  getHistory: async (
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Event>>> => {
    return apiClient.get('/events/history', { page, limit });
  },

  getById: async (id: string): Promise<ApiResponse<{ event: Event }>> => {
    return apiClient.get(`/events/${id}`);
  },

  generate: async (dayNumber?: number): Promise<ApiResponse<{ event: Event }>> => {
    return apiClient.post('/events/generate', { dayNumber });
  },
};

export const statsApi = {
  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get('/stats/dashboard');
  },

  getTrends: async (days: number = 30): Promise<ApiResponse<TrendAnalysis>> => {
    return apiClient.get('/stats/trends', { days });
  },
};
