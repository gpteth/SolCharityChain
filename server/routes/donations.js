const express = require('express');
const router = express.Router();

// Simulated database for storing donations
const donationsDB = [];

// POST: Create a new donation
router.post('/', (req, res) => {
  const { amount, recipient } = req.body;
  if (!amount || !recipient) {
    return res.status(400).json({ error: 'Amount and recipient are required' });
  }

  const donation = {
    amount,
    recipient,
    date: new Date().toISOString(),
  };

  donationsDB.push(donation);
  res.status(201).json(donation);
});

// GET: Get a list of all donations
router.get('/', (req, res) => {
  res.status(200).json(donationsDB);
});

module.exports = router;
