const pool = require('../config/database');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    // Don't send password fields in list response
    const result = await pool.query('SELECT id, email, name FROM users ORDER BY id');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message,
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message,
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const exists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message,
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    // Check if user exists
    const exists = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if new email is already taken
    if (email && email !== exists.rows[0].email) {
      const emailExists = await pool.query('SELECT * FROM users WHERE email = $1 AND id != $2', [
        email,
        id,
      ]);
      if (emailExists.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'Email already in use',
        });
      }
    }

    const result = await pool.query(
      'UPDATE users SET email = COALESCE($1, email), name = COALESCE($2, name) WHERE id = $3 RETURNING id, email, name',
      [email || null, name || null, id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message,
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email, name',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
