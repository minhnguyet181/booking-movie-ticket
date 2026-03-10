import pool from '../config/database';

export class PasswordResetTokenRepository {
  // Create or update reset token
  static async upsert(userId: number, token: string, expiresAt: Date): Promise<void> {
    await pool.execute(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`,
      [userId, token, expiresAt, token, expiresAt]
    );
  }

  // Find reset token
  static async findByToken(token: string): Promise<{ user_id: number; expires_at: Date } | null> {
    const [tokens] = await pool.execute(
      'SELECT user_id, expires_at FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    ) as any[];

    return tokens.length > 0 ? tokens[0] : null;
  }

  // Delete reset token
  static async deleteByToken(token: string): Promise<void> {
    await pool.execute('DELETE FROM password_reset_tokens WHERE token = ?', [token]);
  }
}
