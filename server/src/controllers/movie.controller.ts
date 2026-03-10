import { Request, Response, NextFunction } from 'express';
import { MovieService } from '../services/movie.service';

export class MovieController {
  // Get all movies
  static async getAllMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      let result;
      if (search) {
        result = await MovieService.searchMovies(search, page, limit);
      } else {
        result = await MovieService.getAllMovies(page, limit);
      }

      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  // Get movie by ID
  static async getMovieById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      const movie = await MovieService.getMovieById(id);
      if (!movie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }

      res.json({ movie });
    } catch (error: any) {
      next(error);
    }
  }

  // Create movie (admin only)
  static async createMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const movie = await MovieService.createMovie(req.body);
      res.status(201).json({ message: 'Movie created successfully', movie });
    } catch (error: any) {
      next(error);
    }
  }

  // Update movie (admin only)
  static async updateMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      const movie = await MovieService.updateMovie(id, req.body);
      res.json({ message: 'Movie updated successfully', movie });
    } catch (error: any) {
      next(error);
    }
  }

  // Delete movie (admin only)
  static async deleteMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      await MovieService.deleteMovie(id);
      res.json({ message: 'Movie deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  }
}
