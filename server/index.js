const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/files'));

// Fetch current user route (using token)
app.get('/api/users/me', require('./middleware/auth'), async (req, res) => {
  const { pool } = require('./db');
  try {
    const user = await pool.query('SELECT id, name, email, avatar FROM users WHERE id = $1', [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Fetch all users
app.get('/api/users', require('./middleware/auth'), async (req, res) => {
  const { pool } = require('./db');
  try {
    // Return all users except the current user
    const users = await pool.query('SELECT id, name, email, avatar FROM users WHERE id != $1 ORDER BY name ASC', [req.user.id]);
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Global error handler for Multer and other errors
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
