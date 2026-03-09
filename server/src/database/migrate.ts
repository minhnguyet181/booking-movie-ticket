import pool from '../config/database';
import fs from 'fs';
import path from 'path';

async function migrate() {
  try {
    // Get the directory of the current file
    // __dirname is available in CommonJS after compilation
    let schemaPath: string;
    try {
      schemaPath = path.join(__dirname, 'schema.sql');
    } catch {
      // Fallback: use process.cwd() if __dirname is not available
      schemaPath = path.join(process.cwd(), 'src', 'database', 'schema.sql');
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
