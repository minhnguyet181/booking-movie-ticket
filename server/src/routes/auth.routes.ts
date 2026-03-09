import express from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
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
  async (req, res, next) => {
    try {
      const { username, email, password, full_name, phone } = req.body;
      const user = await AuthService.register({ username, email, password, full_name, phone });
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
      next(error);
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      
      // Set cookies
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      });
    } catch (error: any) {
      next(error);
    }
  }
);

// Logout - không require auth vì user có thể logout khi token hết hạn
router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }
    
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logout successful' });
  } catch (error: any) {
    // Vẫn clear cookies ngay cả khi có lỗi
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await AuthService.getUserById(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (error: any) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }

    const result = await AuthService.refreshToken(refreshToken);
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      token: result.token,
      refreshToken: result.refreshToken
    });
  } catch (error: any) {
    next(error);
  }
});

// Forgot password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Invalid email'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const resetToken = await AuthService.forgotPassword(email);
      
      // In production, send email with reset link
      // For now, return token (remove in production)
      res.json({
        message: 'If the email exists, a reset link has been sent.',
        // Remove this in production:
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });
    } catch (error: any) {
      next(error);
    }
  }
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
  async (req, res, next) => {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);
      res.json({ message: 'Password reset successful' });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
