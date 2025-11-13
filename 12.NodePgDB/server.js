const express = require('express');
const { getAllCustomers } = require('./models/customerModel');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// API endpoint to fetch customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await getAllCustomers();
    res.json({ success: true, data: customers });
  } catch (err) {
    console.error('Error fetching customers:', err.stack || err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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