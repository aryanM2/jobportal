const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name company');
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name company');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Post a job (employer only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ error: 'Access denied' });
  const { title, description, company, location, salary, type, requirements } = req.body;
  try {
    const job = new Job({ title, description, company, location, salary, type, requirements, employer: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get jobs by employer
router.get('/my', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ error: 'Access denied' });
  try {
    const jobs = await Job.find({ employer: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;