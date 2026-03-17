const express = require('express');
const Application = require('../models/Application');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply for a job
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'jobseeker') return res.status(403).json({ error: 'Access denied' });
  const { jobId, coverLetter } = req.body;
  try {
    const application = new Application({ job: jobId, applicant: req.user.id, coverLetter });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get applications for employer's jobs
router.get('/employer', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ error: 'Access denied' });
  try {
    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('applicant', 'name email profile')
      .where('job.employer').equals(req.user.id);
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get applications by jobseeker
router.get('/my', auth, async (req, res) => {
  if (req.user.role !== 'jobseeker') return res.status(403).json({ error: 'Access denied' });
  try {
    const applications = await Application.find({ applicant: req.user.id }).populate('job', 'title company location');
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update application status (employer)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ error: 'Access denied' });
  const { status } = req.body;
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (application.job.employer.toString() !== req.user.id) return res.status(403).json({ error: 'Access denied' });
    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;