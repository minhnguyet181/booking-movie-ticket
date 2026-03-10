import pool from '../config/database';
import { Movie, MovieCreate, MoviePublic } from '../models/Movie';

export class MovieRepository {
  // Find all movies with pagination
  static async findAll(page: number = 1, limit: number = 10): Promise<{ movies: MoviePublic[]; total: number }> {
    const offset = (page - 1) * limit;

    const [countResult] = await pool.execute('SELECT COUNT(*) as count FROM movies') as any[];
    const total = parseInt(countResult[0].count);

    const [movies] = await pool.execute(
      `SELECT id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, image_url, created_at, updated_at
       FROM movies
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    ) as any[];

    return {
      movies: movies as MoviePublic[],
      total
    };
  }

  // Find movie by ID
  static async findById(id: number): Promise<MoviePublic | null> {
    const [movies] = await pool.execute(
      `SELECT id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, image_url, created_at, updated_at
       FROM movies
       WHERE id = ?`,
      [id]
    ) as any[];

    return movies.length > 0 ? (movies[0] as MoviePublic) : null;
  }

  // Find movie by name (for duplicate check)
  static async findByName(name: string, excludeId?: number): Promise<Movie | null> {
    if (excludeId) {
      const [movies] = await pool.execute(
        'SELECT * FROM movies WHERE LOWER(name) = LOWER(?) AND id != ?',
        [name, excludeId]
      ) as any[];
      return movies.length > 0 ? (movies[0] as Movie) : null;
    }

    const [movies] = await pool.execute(
      'SELECT * FROM movies WHERE LOWER(name) = LOWER(?)',
      [name]
    ) as any[];

    return movies.length > 0 ? (movies[0] as Movie) : null;
  }

  // Create movie
  static async create(movieData: MovieCreate): Promise<MoviePublic> {
    const { name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, image_url } = movieData;

    const [result] = await pool.execute(
      `INSERT INTO movies (name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, image_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, country, year, genre, duration, age_restriction, main_cast, description, poster_url || null, image_url || null]
    ) as any;

    const [newMovie] = await pool.execute(
      'SELECT id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, image_url, created_at, updated_at FROM movies WHERE id = ?',
      [result.insertId]
    ) as any[];

    return newMovie[0] as MoviePublic;
  }

  // Update movie
  static async update(id: number, movieData: Partial<MovieCreate>): Promise<MoviePublic> {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = ['name', 'country', 'year', 'genre', 'duration', 'age_restriction', 'main_cast', 'description', 'poster_url', 'image_url'];
    
    for (const field of allowedFields) {
      if (movieData[field as keyof MovieCreate] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(movieData[field as keyof MovieCreate]);
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE movies SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const [updatedMovie] = await pool.execute(
      'SELECT id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, image_url, created_at, updated_at FROM movies WHERE id = ?',
      [id]
    ) as any[];

    return updatedMovie[0] as MoviePublic;
  }

  // Delete movie
  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM movies WHERE id = ?', [id]) as any;
    return result.affectedRows > 0;
  }

  // Search movies
  static async search(query: string, page: number = 1, limit: number = 10): Promise<{ movies: MoviePublic[]; total: number }> {
    const offset = (page - 1) * limit;
    const searchTerm = `%${query.toLowerCase()}%`;

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM movies 
       WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(main_cast) LIKE ?`,
      [searchTerm, searchTerm, searchTerm]
    ) as any[];
    const total = parseInt(countResult[0].count);

    const [movies] = await pool.execute(
      `SELECT id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, image_url, created_at, updated_at
       FROM movies
       WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(main_cast) LIKE ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, limit, offset]
    ) as any[];

    return {
      movies: movies as MoviePublic[],
      total
    };
  }
}
