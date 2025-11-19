const pool = require('../config/database');

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY id');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees',
      message: error.message,
    });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee',
      message: error.message,
    });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  try {
    const { name, position, email, salary } = req.body;

    const result = await pool.query(
      'INSERT INTO employees (name, position, email, salary) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, position, email, salary]
    );

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create employee',
      message: error.message,
    });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, email, salary } = req.body;

    // Check if employee exists
    const exists = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found',
      });
    }

    const result = await pool.query(
      'UPDATE employees SET name = $1, position = $2, email = $3, salary = $4 WHERE id = $5 RETURNING *',
      [name, position, email, salary, id]
    );

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update employee',
      message: error.message,
    });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found',
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete employee',
      message: error.message,
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
