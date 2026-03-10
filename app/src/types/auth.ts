export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  full_name?: string;
  phone?: string;
}
