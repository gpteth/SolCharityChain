const express = require('express');
const router = express.Router();

// Simulated database for user accounts
const userAccountsDB = [];

// POST: Create a new user account
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  // Check if the email is already in use
  const existingUser = userAccountsDB.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already registered' });
  }

  const newUser = {
    username,
    email,
    password,
  };

  userAccountsDB.push(newUser);
  res.status(201).json(newUser);
});

// GET: Get user account details
router.get('/:username', (req, res) => {
  const { username } = req.params;
  const user = userAccountsDB.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json(user);
});

module.exports = router;
