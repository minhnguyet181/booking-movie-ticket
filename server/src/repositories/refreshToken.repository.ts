import pool from '../config/database';

export class RefreshTokenRepository {
  // Create refresh token
  static async create(userId: number, token: string, expiresAt: Date): Promise<void> {
    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt]
    );
  }

  // Find refresh token
  static async findByToken(token: string): Promise<{ user_id: number; expires_at: Date } | null> {
    const [tokens] = await pool.execute(
      'SELECT user_id, expires_at FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    ) as any[];

    return tokens.length > 0 ? tokens[0] : null;
  }

  // Update refresh token
  static async updateToken(oldToken: string, newToken: string, expiresAt: Date): Promise<void> {
    await pool.execute(
      'UPDATE refresh_tokens SET token = ?, expires_at = ? WHERE token = ?',
      [newToken, expiresAt, oldToken]
    );
  }

  // Delete refresh token
  static async deleteByToken(token: string): Promise<void> {
    await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  }

  // Delete all refresh tokens for user
  static async deleteByUserId(userId: number): Promise<void> {
    await pool.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
  }
}
