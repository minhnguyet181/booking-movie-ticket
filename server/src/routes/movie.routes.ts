import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { MovieController } from '../controllers/movie.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = express.Router();

// Validation middleware
const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all movies with pagination (public)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().withMessage('Search must be a string'),
  ],
  validate,
  MovieController.getAllMovies
);

// Get movie by ID (public)
router.get('/:id', MovieController.getMovieById);

// Create movie (admin only)
router.post(
  '/',
  authenticate,
  requireAdmin,
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
    body('image_url').optional().isURL().withMessage('Image URL must be a valid URL'),
  ],
  validate,
  MovieController.createMovie
);

// Update movie (admin only)
router.put(
  '/:id',
  authenticate,
  requireAdmin,
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
    body('image_url').optional().isURL().withMessage('Image URL must be a valid URL'),
  ],
  validate,
  MovieController.updateMovie
);

// Delete movie (admin only)
router.delete('/:id', authenticate, requireAdmin, MovieController.deleteMovie);

export default router;
