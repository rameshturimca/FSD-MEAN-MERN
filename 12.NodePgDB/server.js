const express = require('express');
const { getAllCustomers } = require('./models/customerModel');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// API endpoint to fetch all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await getAllCustomers();
    res.json({ success: true, data: customers });
  } catch (err) {
    console.error('Error fetching customers:', err.stack || err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// API endpoint to fetch a specific customer by ID
app.get('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching customer:', err.stack || err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// API endpoint to create a new customer
app.post('/api/customers', async (req, res) => {
  const { first_name, last_name, email, city, country, join_date, total_spent } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO customers (first_name, last_name, email, city, country, join_date, total_spent) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [first_name, last_name, email, city, country, join_date, total_spent]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error creating customer:', err.stack || err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// API endpoint to update a customer by ID
app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, city, country, join_date, total_spent } = req.body;
  try {
    const result = await pool.query(
      'UPDATE customers SET first_name = $1, last_name = $2, email = $3, city = $4, country = $5, join_date = $6, total_spent = $7 WHERE customer_id = $8 RETURNING *',
      [first_name, last_name, email, city, country, join_date, total_spent, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error updating customer:', err.stack || err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// API endpoint to delete a customer by ID
app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM customers WHERE customer_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error deleting customer:', err.stack || err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// HEAD request for customers
app.head('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM customers');
    res.set('X-Total-Count', result.rows[0].count);
    res.status(200).end();
  } catch (err) {
    console.error('Error handling HEAD request:', err.stack || err.message);
    res.status(500).end();
  }
});

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.stack || err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Initializing server...');
});

let poolClosed = false; // Flag to track pool closure

// Refactored SIGINT handler
process.on('SIGINT', async () => {
  if (poolClosed) {
    console.log('SIGINT received: Pool already closed. Exiting gracefully.');
    process.exit(0);
  }
  console.log('SIGINT received: Attempting to close database pool...');
  poolClosed = true; // Set the flag immediately to prevent re-entry
  try {
    await pool.end();
    console.log('Database pool closed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error while closing database pool:', err.message);
    process.exit(1);
  }
});

// Gracefully close the pool on process exit
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Database pool closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing pool:', err.message);
    process.exit(1);
  }
});