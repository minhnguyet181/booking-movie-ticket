import { Movie, MovieCreate, MovieUpdate, MoviePublic } from '../models/Movie';
import { MovieRepository } from '../repositories/movie.repository';

export class MovieService {
  // Get all movies with pagination
  static async getAllMovies(page: number = 1, limit: number = 10): Promise<{ movies: MoviePublic[]; total: number; totalPages: number }> {
    const result = await MovieRepository.findAll(page, limit);
    return {
      ...result,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  // Get movie by ID
  static async getMovieById(id: number): Promise<MoviePublic | null> {
    return await MovieRepository.findById(id);
  }

  // Create movie
  static async createMovie(movieData: MovieCreate): Promise<MoviePublic> {
    const { name } = movieData;

    // Check if movie with same name already exists
    const existingMovie = await MovieRepository.findByName(name);
    if (existingMovie) {
      throw new Error('Movie with this name already exists');
    }

    return await MovieRepository.create(movieData);
  }

  // Update movie
  static async updateMovie(id: number, movieData: Partial<MovieCreate>): Promise<MoviePublic> {
    // Check if movie exists
    const [existingMovie] = await pool.execute('SELECT id FROM movies WHERE id = ?', [id]) as any[];
    if (existingMovie.length === 0) {
      throw new Error('Movie not found');
    }

    // If name is being updated, check for duplicates
    if (movieData.name) {
      const [duplicateCheck] = await pool.execute(
        'SELECT id FROM movies WHERE LOWER(name) = LOWER(?) AND id != ?',
        [movieData.name, id]
      ) as any[];
      if (duplicateCheck.length > 0) {
        throw new Error('Movie with this name already exists');
      }
    }

    // Build update query dynamically
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = ['name', 'country', 'year', 'genre', 'duration', 'age_restriction', 'main_cast', 'description', 'poster_url'];
    
    for (const field of allowedFields) {
      if (movieData[field as keyof MovieCreate] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(movieData[field as keyof MovieCreate]);
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
      WHERE id = ?
    `;

    await pool.execute(query, values);

    // Get the updated movie
    const [updatedMovie] = await pool.execute(
      'SELECT id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, created_at, updated_at FROM movies WHERE id = ?',
      [id]
    ) as any[];

    return updatedMovie[0] as MoviePublic;
  }

  // Delete movie
  static async deleteMovie(id: number): Promise<void> {
    const deleted = await MovieRepository.delete(id);
    if (!deleted) {
      throw new Error('Movie not found');
    }
  }

  // Search movies
  static async searchMovies(query: string, page: number = 1, limit: number = 10): Promise<{ movies: MoviePublic[]; total: number; totalPages: number }> {
    const result = await MovieRepository.search(query, page, limit);
    return {
      ...result,
      totalPages: Math.ceil(result.total / limit)
    };
  }
}
