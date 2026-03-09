import axios from 'axios';
import { Movie, MovieCreate, MoviesResponse } from '../types/movie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
            `${API_URL}/auth/refresh`,
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

export const movieService = {
  async getAllMovies(page: number = 1, limit: number = 10, search?: string): Promise<MoviesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) {
      params.append('search', search);
    }
    const response = await api.get(`/movies?${params.toString()}`);
    return response.data;
  },

  async getMovieById(id: number): Promise<Movie> {
    const response = await api.get(`/movies/${id}`);
    return response.data.movie;
  },

  async createMovie(data: MovieCreate): Promise<Movie> {
    const response = await api.post('/movies', data);
    return response.data.movie;
  },

  async updateMovie(id: number, data: Partial<MovieCreate>): Promise<Movie> {
    const response = await api.put(`/movies/${id}`, data);
    return response.data.movie;
  },

  async deleteMovie(id: number): Promise<void> {
    await api.delete(`/movies/${id}`);
  },
};
