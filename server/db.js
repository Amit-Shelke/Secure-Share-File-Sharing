const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        size VARCHAR(50) NOT NULL,
        hash VARCHAR(255) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS shared_files (
        id SERIAL PRIMARY KEY,
        file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
        shared_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        shared_with VARCHAR(100) NOT NULL, -- Email of the person receiving the file
        permission VARCHAR(50) NOT NULL,
        shared_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized with tables");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    client.release();
  }
};

initDB();

module.exports = { pool };
