import pool from '../config/database';
import fs from 'fs';
import path from 'path';

async function migrate() {
  let connection;
  try {
    // Get the directory of the current file
    let schemaPath: string;
    try {
      schemaPath = path.join(__dirname, 'schema_mysql.sql');
    } catch {
      // Fallback: use process.cwd() if __dirname is not available
      schemaPath = path.join(process.cwd(), 'src', 'database', 'schema_mysql.sql');
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Get a connection from the pool
    connection = await pool.getConnection();
    
    // Split schema into individual statements and execute
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      await connection.execute(statement);
    }
    
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.release();
    }
    await pool.end();
  }
}

migrate();
