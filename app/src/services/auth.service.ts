import axios from 'axios';
import { User, LoginResponse, RegisterData } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_URL}/refresh`,
            { refreshToken },
            { withCredentials: true }
          );

          const { token, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/login', { username, password });
    return response.data;
  },

  async register(data: RegisterData): Promise<void> {
    await api.post('/register', data);
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    await api.post('/logout', { refreshToken });
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/me');
    return response.data.user;
  },

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string, confirmPassword: string): Promise<void> {
    await api.post('/reset-password', { token, password, confirmPassword });
  },
};
