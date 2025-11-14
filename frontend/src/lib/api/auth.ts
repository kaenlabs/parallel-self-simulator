import { apiClient } from './client';
import { ApiResponse, AuthResponse } from '@/types/api.types';
import { User } from '@/types';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterInput): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (response.success && response.data) {
      apiClient.setToken(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },

  login: async (data: LoginInput): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    if (response.success && response.data) {
      apiClient.setToken(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    return apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
  },

  refresh: async (): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    return apiClient.post('/auth/refresh');
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
};
