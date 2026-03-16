import bcrypt from 'bcrypt';
import pool from '../config/database';

async function seedAdmin() {
  try {
    // Hash password for admin
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Insert admin user
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
      ['admin', 'admin@filmhub.com', hashedPassword, 'Administrator', 'admin']
    );
    connection.release();

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await pool.end();
  }
}

seedAdmin();