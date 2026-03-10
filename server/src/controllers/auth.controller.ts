import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserCreate } from '../models/User';

export class AuthController {
  // Register
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password, full_name, phone } = req.body;
      const userData: UserCreate = { username, email, password, full_name, phone, role: 'user' };
      const user = await AuthService.register(userData);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
      next(error);
    }
  }

  // Login
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  // Logout
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  }

  // Get current user
  static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as any;
      if (!authReq.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const user = await AuthService.getUserById(authReq.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ user });
    } catch (error: any) {
      next(error);
    }
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  }

  // Forgot password
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const resetToken = await AuthService.forgotPassword(email);
      
      res.json({
        message: 'If the email exists, a reset link has been sent.',
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Reset password
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);
      res.json({ message: 'Password reset successful' });
    } catch (error: any) {
      next(error);
    }
  }
}
