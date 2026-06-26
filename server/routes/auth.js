const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create simple avatar based on initials
    const avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING id, name, email, avatar',
      [name, email, hashedPassword, avatar]
    );

    const payload = { user: { id: newUser.rows[0].id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: newUser.rows[0] });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'A server error occurred. Ensure environment variables are set correctly.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.rows[0].id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      const { password, ...userData } = user.rows[0];
      res.json({ token, user: userData });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'A server error occurred. Ensure environment variables are set correctly.' });
  }
});

module.exports = router;
