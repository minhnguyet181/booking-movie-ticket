import express from 'express';
import { body, validationResult } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware
const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  validate,
  AuthController.register
);

// Login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  AuthController.login
);

// Logout
router.post('/logout', AuthController.logout);

// Get current user
router.get('/me', authenticate, AuthController.getCurrentUser);

// Refresh token
router.post('/refresh', AuthController.refreshToken);

// Forgot password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Invalid email'),
  ],
  validate,
  AuthController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  validate,
  AuthController.resetPassword
);

export default router;
