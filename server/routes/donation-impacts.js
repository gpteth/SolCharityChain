const express = require('express');
const router = express.Router();

// Simulated database for tracking donation impact
const donationImpactDB = [];

// POST: Record donation impact
router.post('/', (req, res) => {
  const { donationId, impactDescription } = req.body;
  if (!donationId || !impactDescription) {
    return res.status(400).json({ error: 'Donation ID and impact description are required' });
  }

  const donationImpact = {
    donationId,
    impactDescription,
    timestamp: new Date().toISOString(),
  };

  donationImpactDB.push(donationImpact);
  res.status(201).json(donationImpact);
});

// GET: Get donation impact records
router.get('/', (req, res) => {
  res.status(200).json(donationImpactDB);
});

module.exports = router;
