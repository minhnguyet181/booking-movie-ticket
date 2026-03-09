import pool from '../config/database';
import { Movie, MovieCreate, MovieUpdate, MoviePublic } from '../models/Movie';

export class MovieService {
  // Get all movies with pagination
  static async getAllMovies(page: number = 1, limit: number = 10): Promise<{ movies: MoviePublic[]; total: number; totalPages: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM movies');
    const total = parseInt(countResult.rows[0].count);

    // Get movies
    const result = await pool.query(
      `SELECT id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, created_at, updated_at
       FROM movies
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return {
      movies: result.rows as MoviePublic[],
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Get movie by ID
  static async getMovieById(id: number): Promise<MoviePublic | null> {
    const result = await pool.query(
      `SELECT id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, created_at, updated_at
       FROM movies
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as MoviePublic;
  }

  // Create movie
  static async createMovie(movieData: MovieCreate): Promise<MoviePublic> {
    const { name, country, year, genre, duration, age_restriction, main_cast, description, poster_url } = movieData;

    // Check if movie with same name already exists
    const existingMovie = await pool.query(
      'SELECT id FROM movies WHERE LOWER(name) = LOWER($1)',
      [name]
    );

    if (existingMovie.rows.length > 0) {
      throw new Error('Movie with this name already exists');
    }

    const result = await pool.query(
      `INSERT INTO movies (name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, created_at, updated_at`,
      [name, country, year, genre, duration, age_restriction, main_cast, description, poster_url || null]
    );

    return result.rows[0] as MoviePublic;
  }

  // Update movie
  static async updateMovie(id: number, movieData: Partial<MovieCreate>): Promise<MoviePublic> {
    // Check if movie exists
    const existingMovie = await pool.query('SELECT id FROM movies WHERE id = $1', [id]);
    if (existingMovie.rows.length === 0) {
      throw new Error('Movie not found');
    }

    // If name is being updated, check for duplicates
    if (movieData.name) {
      const duplicateCheck = await pool.query(
        'SELECT id FROM movies WHERE LOWER(name) = LOWER($1) AND id != $2',
        [movieData.name, id]
      );
      if (duplicateCheck.rows.length > 0) {
        throw new Error('Movie with this name already exists');
      }
    }

    // Build update query dynamically
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = ['name', 'country', 'year', 'genre', 'duration', 'age_restriction', 'main_cast', 'description', 'poster_url'];
    
    for (const field of allowedFields) {
      if (movieData[field as keyof MovieCreate] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(movieData[field as keyof MovieCreate]);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updated_at
    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE movies
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    return result.rows[0] as MoviePublic;
  }

  // Delete movie
  static async deleteMovie(id: number): Promise<void> {
    const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Movie not found');
    }
  }

  // Search movies
  static async searchMovies(query: string, page: number = 1, limit: number = 10): Promise<{ movies: MoviePublic[]; total: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    const searchTerm = `%${query.toLowerCase()}%`;

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM movies 
       WHERE LOWER(name) LIKE $1 OR LOWER(description) LIKE $1 OR LOWER(main_cast) LIKE $1`,
      [searchTerm]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get movies
    const result = await pool.query(
      `SELECT id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, created_at, updated_at
       FROM movies
       WHERE LOWER(name) LIKE $1 OR LOWER(description) LIKE $1 OR LOWER(main_cast) LIKE $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [searchTerm, limit, offset]
    );

    return {
      movies: result.rows as MoviePublic[],
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
}
