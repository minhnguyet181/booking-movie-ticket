export interface Movie {
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
  created_at: string;
  updated_at: string;
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
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  totalPages: number;
}
