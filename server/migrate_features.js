const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('Starting migration...');

    // 1. Create audit_logs table for Feature 3 (Audit Logs)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created audit_logs table');

    // 2. Add expires_at (Feature 2) and pin (Feature 5) to shared_files
    try {
      await pool.query(`ALTER TABLE shared_files ADD COLUMN expires_at TIMESTAMP`);
      console.log('Added expires_at to shared_files');
    } catch (e) { console.log('expires_at already exists or error:', e.message); }

    try {
      await pool.query(`ALTER TABLE shared_files ADD COLUMN pin VARCHAR(255)`);
      console.log('Added pin to shared_files');
    } catch (e) { console.log('pin already exists or error:', e.message); }

    // 3. Add encryption fields to files for Feature 1 (E2EE)
    try {
      await pool.query(`ALTER TABLE files ADD COLUMN is_encrypted BOOLEAN DEFAULT false`);
      console.log('Added is_encrypted to files');
    } catch (e) { console.log('is_encrypted already exists or error:', e.message); }

    try {
      await pool.query(`ALTER TABLE files ADD COLUMN iv VARCHAR(255)`);
      console.log('Added iv to files');
    } catch (e) { console.log('iv already exists or error:', e.message); }

    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
