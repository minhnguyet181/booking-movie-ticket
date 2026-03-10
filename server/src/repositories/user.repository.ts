import pool from '../config/database';
import { User, UserCreate, UserPublic } from '../models/User';

export class UserRepository {
  // Find user by username or email
  static async findByUsernameOrEmail(username: string, email?: string): Promise<User | null> {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email || username]
    ) as any[];

    return users.length > 0 ? (users[0] as User) : null;
  }

  // Find user by ID
  static async findById(id: number): Promise<User | null> {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    ) as any[];

    return users.length > 0 ? (users[0] as User) : null;
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as any[];

    return users.length > 0 ? (users[0] as User) : null;
  }

  // Create user
  static async create(userData: UserCreate): Promise<UserPublic> {
    const { username, email, password, full_name, phone, role } = userData;

    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password, full_name, phone, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [username, email, password, full_name || null, phone || null, role || 'user']
    ) as any;

    const [newUser] = await pool.execute(
      'SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    ) as any[];

    return newUser[0] as UserPublic;
  }

  // Update user
  static async update(id: number, userData: Partial<UserCreate>): Promise<UserPublic> {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = ['username', 'email', 'password', 'full_name', 'phone', 'role'];
    
    for (const field of allowedFields) {
      if (userData[field as keyof UserCreate] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(userData[field as keyof UserCreate]);
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const [updatedUser] = await pool.execute(
      'SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = ?',
      [id]
    ) as any[];

    return updatedUser[0] as UserPublic;
  }

  // Check if username or email exists
  static async exists(username: string, email: string): Promise<boolean> {
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    ) as any[];

    return users.length > 0;
  }
}
