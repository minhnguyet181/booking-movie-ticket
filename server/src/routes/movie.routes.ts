import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { MovieService } from '../services/movie.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware
const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all movies with pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().withMessage('Search must be a string'),
  ],
  validate,
  async (req, res, next) => {
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
);

// Get movie by ID
router.get('/:id', async (req, res, next) => {
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
});

// Create movie (requires authentication)
router.post(
  '/',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Movie name is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('year').isInt({ min: 1900, max: 2100 }).withMessage('Year must be between 1900 and 2100'),
    body('genre').trim().notEmpty().withMessage('Genre is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('age_restriction').trim().notEmpty().withMessage('Age restriction is required'),
    body('main_cast').trim().notEmpty().withMessage('Main cast is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('poster_url').optional().isURL().withMessage('Poster URL must be a valid URL'),
  ],
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const movie = await MovieService.createMovie(req.body);
      res.status(201).json({ message: 'Movie created successfully', movie });
    } catch (error: any) {
      next(error);
    }
  }
);

// Update movie (requires authentication)
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().trim().notEmpty().withMessage('Movie name cannot be empty'),
    body('country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
    body('year').optional().isInt({ min: 1900, max: 2100 }).withMessage('Year must be between 1900 and 2100'),
    body('genre').optional().trim().notEmpty().withMessage('Genre cannot be empty'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('age_restriction').optional().trim().notEmpty().withMessage('Age restriction cannot be empty'),
    body('main_cast').optional().trim().notEmpty().withMessage('Main cast cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('poster_url').optional().isURL().withMessage('Poster URL must be a valid URL'),
  ],
  validate,
  async (req: AuthRequest, res, next) => {
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
);

// Delete movie (requires authentication)
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
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
});

export default router;
