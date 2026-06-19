import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    try {
      await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
      // Create applications table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS applications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          company_name VARCHAR(255) NOT NULL,
          job_title VARCHAR(255) NOT NULL,
          job_type VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          applied_date TIMESTAMP NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Database schema initialized successfully');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function closeDatabase() {
  await pool.end();
}
