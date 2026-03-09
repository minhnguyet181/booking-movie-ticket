import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { User, UserCreate, UserPublic } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // Compare password
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static generateToken(userId: number, username: string): string {
    return jwt.sign(
      { userId, username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  // Generate refresh token
  static generateRefreshToken(userId: number, username: string): string {
    return jwt.sign(
      { userId, username, type: 'refresh' },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  }

  // Verify token
  static verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): any {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  }

  // Register user
  static async register(userData: UserCreate): Promise<UserPublic> {
    const { username, email, password, full_name, phone } = userData;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (username, email, password, full_name, phone, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, username, email, full_name, phone, created_at`,
      [username, email, hashedPassword, full_name || null, phone || null]
    );

    return result.rows[0];
  }

  // Login user
  static async login(username: string, password: string): Promise<{ user: UserPublic; token: string; refreshToken: string }> {
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0] as User;

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const token = this.generateToken(user.id, user.username);
    const refreshToken = this.generateRefreshToken(user.id, user.username);

    // Store refresh token in database
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')',
      [user.id, refreshToken]
    );

    // Return user without password
    const { password: _, ...userPublic } = user;
    return {
      user: userPublic as UserPublic,
      token,
      refreshToken
    };
  }

  // Logout user - xóa refresh token
  static async logout(refreshToken: string): Promise<void> {
    if (refreshToken) {
      await pool.query(
        'DELETE FROM refresh_tokens WHERE token = $1',
        [refreshToken]
      );
    }
  }

  // Logout all sessions - xóa tất cả refresh tokens của user
  static async logoutAll(userId: number): Promise<void> {
    await pool.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1',
      [userId]
    );
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    // Verify refresh token
    const decoded = this.verifyRefreshToken(refreshToken) as { userId: number; username: string };

    // Check if refresh token exists in database
    const tokenResult = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const newToken = this.generateToken(decoded.userId, decoded.username);
    const newRefreshToken = this.generateRefreshToken(decoded.userId, decoded.username);

    // Update refresh token in database
    await pool.query(
      'UPDATE refresh_tokens SET token = $1, expires_at = NOW() + INTERVAL \'30 days\' WHERE token = $2',
      [newRefreshToken, refreshToken]
    );

    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  }

  // Forgot password - generate reset token
  static async forgotPassword(email: string): Promise<string> {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Don't reveal if email exists for security
      return 'If the email exists, a reset link has been sent.';
    }

    const userId = result.rows[0].id;
    const resetToken = jwt.sign(
      { userId, type: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store reset token
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')
       ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL '1 hour'`,
      [userId, resetToken]
    );

    return resetToken;
  }

  // Reset password
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; type: string };
    
    if (decoded.type !== 'password-reset') {
      throw new Error('Invalid token');
    }

    // Check if token exists and is valid
    const tokenResult = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      throw new Error('Invalid or expired reset token');
    }

    const userId = tokenResult.rows[0].user_id;

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    // Delete reset token
    await pool.query(
      'DELETE FROM password_reset_tokens WHERE token = $1',
      [token]
    );
  }

  // Get user by ID
  static async getUserById(userId: number): Promise<UserPublic | null> {
    const result = await pool.query(
      'SELECT id, username, email, full_name, phone, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as UserPublic;
  }
}
