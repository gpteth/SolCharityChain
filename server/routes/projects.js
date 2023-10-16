const express = require('express');
const router = express.Router();

// Simulated database for storing community projects
const projectsDB = [];

// POST: Create a new community project
router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const project = {
    title,
    description,
    date: new Date().toISOString(),
  };

  projectsDB.push(project);
  res.status(201).json(project);
});

// GET: Get a list of all community projects
router.get('/', (req, res) => {
  res.status(200).json(projectsDB);
});

module.exports = router;
