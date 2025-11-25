const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM USERS ORDER BY user_id');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM USERS WHERE user_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  const { first_name, last_name, email, hashed_password, user_role, address_line1, city } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO USERS (first_name, last_name, email, hashed_password, user_role, address_line1, city) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashed_password, user_role, address_line1, city]
    );
    res.status(201).json({ user_id: result.insertId, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

// POST login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM USERS WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    // In a real app, you would hash and compare passwords properly
    if (user.hashed_password === password) {
      res.json({
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_role: user.user_role,
        address_line1: user.address_line1,
        city: user.city
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  const { first_name, last_name, email, hashed_password, user_role, address_line1, city } = req.body;
  try {
    await db.execute(
      'UPDATE USERS SET first_name = ?, last_name = ?, email = ?, hashed_password = ?, user_role = ?, address_line1 = ?, city = ? WHERE user_id = ?',
      [first_name, last_name, email, hashed_password, user_role, address_line1, city, req.params.id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM USERS WHERE user_id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;