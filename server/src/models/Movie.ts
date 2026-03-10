export interface Movie {
  id: number;
  name: string;
  country: string;
  year: number;
  genre: string;
  duration: number; // in minutes
  age_restriction: string;
  main_cast: string;
  description: string;
  poster_url?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface MovieCreate {
  name: string;
  country: string;
  year: number;
  genre: string;
  duration: number;
  age_restriction: string;
  main_cast: string;
  description: string;
  poster_url?: string;
  image_url?: string;
}

export interface MovieUpdate extends Partial<MovieCreate> {
  id: number;
}

export interface MoviePublic {
  id: number;
  name: string;
  country: string;
  year: number;
  genre: string;
  duration: number;
  age_restriction: string;
  main_cast: string;
  description: string;
  poster_url?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}
