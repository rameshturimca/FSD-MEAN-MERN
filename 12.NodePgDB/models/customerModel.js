// models/customerModel.js
const pool = require('../config/db');

async function getAllCustomers() {
  try {
    const result = await pool.query('SELECT * FROM customers');
    return result.rows;
  } catch (err) {
    console.error('DB query error in getAllCustomers:', err.message);
    throw err;
  }
}

module.exports = { getAllCustomers };
