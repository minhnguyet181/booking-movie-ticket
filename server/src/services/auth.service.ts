import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserCreate, UserPublic } from '../models/User';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { PasswordResetTokenRepository } from '../repositories/passwordResetToken.repository';

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
    const { username, email, password } = userData;

    // Check if user already exists
    const exists = await UserRepository.exists(username, email);
    if (exists) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = await UserRepository.create({
      ...userData,
      password: hashedPassword
    });

    return user;
  }

  // Login user
  static async login(username: string, password: string): Promise<{ user: UserPublic; token: string; refreshToken: string }> {
    // Find user
    const user = await UserRepository.findByUsernameOrEmail(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const token = this.generateToken(user.id, user.username);
    const refreshToken = this.generateRefreshToken(user.id, user.username);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await RefreshTokenRepository.create(user.id, refreshToken, expiresAt);

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
      await RefreshTokenRepository.deleteByToken(refreshToken);
    }
  }

  // Logout all sessions - xóa tất cả refresh tokens của user
  static async logoutAll(userId: number): Promise<void> {
    await RefreshTokenRepository.deleteByUserId(userId);
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    // Verify refresh token
    const decoded = this.verifyRefreshToken(refreshToken) as { userId: number; username: string };

    // Check if refresh token exists in database
    const tokenData = await RefreshTokenRepository.findByToken(refreshToken);
    if (!tokenData) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const newToken = this.generateToken(decoded.userId, decoded.username);
    const newRefreshToken = this.generateRefreshToken(decoded.userId, decoded.username);

    // Update refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await RefreshTokenRepository.updateToken(refreshToken, newRefreshToken, expiresAt);

    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  }

  // Forgot password - generate reset token
  static async forgotPassword(email: string): Promise<string> {
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any[];

    if (users.length === 0) {
      // Don't reveal if email exists for security
      return 'If the email exists, a reset link has been sent.';
    }

    const userId = users[0].id;
    const resetToken = jwt.sign(
      { userId, type: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store reset token (MySQL uses INSERT ... ON DUPLICATE KEY UPDATE)
    await pool.execute(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))
       ON DUPLICATE KEY UPDATE token = ?, expires_at = DATE_ADD(NOW(), INTERVAL 1 HOUR)`,
      [userId, resetToken, resetToken]
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
    const tokenData = await PasswordResetTokenRepository.findByToken(token);
    if (!tokenData) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password
    await UserRepository.update(tokenData.user_id, { password: hashedPassword });

    // Delete reset token
    await PasswordResetTokenRepository.deleteByToken(token);
  }

  // Get user by ID
  static async getUserById(userId: number): Promise<UserPublic | null> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      return null;
    }

    const { password, ...userPublic } = user;
    return userPublic as UserPublic;
  }
}
