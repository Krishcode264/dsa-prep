import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Altering users table...');
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS password_hash TEXT;
    `);
    
    // For any existing users without email/password, we'll need them to "update" later 
    // but for now let's just make them non-null for the schema to match future inserts
    // Actually, it's safer to leave them nullable for old users and NOT NULL for new ones at the app level
    // OR just update schema to allow nulls temporarily.
    
    console.log('Database updated.');
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    await pool.end();
  }
}

run();
