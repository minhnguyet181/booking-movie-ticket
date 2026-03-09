export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

export interface UserPublic {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: Date;
}
