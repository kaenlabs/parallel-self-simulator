import { apiClient } from './client';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { Event } from '@/types';

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
