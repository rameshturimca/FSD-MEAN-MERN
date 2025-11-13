// seed.js - creates customers table if missing and seeds sample rows (if table empty)
const pool = require('./config/db');

const sampleCustomers = [
  ['Alice', 'Johnson', 'alice.johnson@example.com', 'New York', 'USA', '2022-05-10', 1200.5],
  ['Bob', 'Smith', 'bob.smith@example.com', 'Los Angeles', 'USA', '2021-08-14', 845.75],
  ['Charlie', 'Brown', 'charlie.brown@example.com', 'London', 'UK', '2023-02-20', 1540.0],
  ['Diana', 'Evans', 'diana.evans@example.com', 'Toronto', 'Canada', '2022-10-03', 975.2],
  ['Ethan', 'Wright', 'ethan.wright@example.com', 'Sydney', 'Australia', '2021-12-19', 2100.0],
  ['Fiona', 'Clark', 'fiona.clark@example.com', 'Dublin', 'Ireland', '2022-06-29', 640.3],
  ['George', 'Hall', 'george.hall@example.com', 'Berlin', 'Germany', '2023-03-15', 1875.9],
  ['Hannah', 'Lee', 'hannah.lee@example.com', 'Seoul', 'South Korea', '2022-01-22', 1320.45],
  ['Ian', 'Martinez', 'ian.martinez@example.com', 'Madrid', 'Spain', '2023-07-11', 890.75],
  ['Julia', 'Nguyen', 'julia.nguyen@example.com', 'San Francisco', 'USA', '2021-11-08', 2300.6],
];

async function seed() {
  try {
    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id SERIAL PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100),
        city VARCHAR(50),
        country VARCHAR(50),
        join_date DATE,
        total_spent NUMERIC(10,2)
      );
    `);

    // Check if table already has rows
    const countRes = await pool.query('SELECT COUNT(*) FROM customers');
    const count = parseInt(countRes.rows[0].count, 10);
    if (count > 0) {
      console.log(`customers table already has ${count} row(s). Skipping insert.`);
      return;
    }

    const insertText = `
      INSERT INTO customers (first_name, last_name, email, city, country, join_date, total_spent)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    for (const row of sampleCustomers) {
      await pool.query(insertText, row);
    }

    console.log('Seeding completed: inserted', sampleCustomers.length, 'rows');
  } catch (err) {
    console.error('Seeding error:', err.stack || err.message);
  } finally {
    try {
      await pool.end();
    } catch (e) {
      console.warn('Error closing pool after seed:', e.message);
    }
    process.exit(0);
  }
}

seed();
