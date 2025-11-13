// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a pool using env vars from .env (or falling back to sensible defaults)
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
});

// Helpful runtime checks/logging
pool.on('error', (err) => {
  // This event is emitted for errors on idle clients
  console.error('Unexpected error on idle Postgres client', err);
});

(async () => {
  // Try a quick connection test on startup so connection problems surface early
  try {
    const client = await pool.connect();
    client.release();
  } catch (err) {
    console.error('Error connecting to Postgres (check .env and that the server is running):', err.message);
  }
})();

module.exports = pool;
