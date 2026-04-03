const express = require('express');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Apply for a job with resume upload
router.post('/', auth, upload.single('resume'), async (req, res) => {
  if (req.user.role !== 'jobseeker') return res.status(403).json({ error: 'Access denied' });
  
  const { jobId, coverLetter } = req.body;
  const resumeFile = req.file;
  
  try {
    const applicationData = {
      job: jobId,
      applicant: req.user.id,
      coverLetter
    };
    
    // Add resume info if uploaded
    if (resumeFile) {
      applicationData.resume = {
        filename: resumeFile.filename,
        originalName: resumeFile.originalname,
        path: resumeFile.path,
        size: resumeFile.size,
        mimeType: resumeFile.mimetype
      };
    }
    
    const application = new Application(applicationData);
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
      .populate({
        path: 'job',
        match: { employer: req.user.id },
        select: 'title company location salary type'
      })
      .populate('applicant', 'name email profile phone');
    
    // Filter out applications where job match failed (job doesn't belong to this employer)
    const validApplications = applications.filter(app => app.job !== null);
    res.json(validApplications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get applications by jobseeker
router.get('/my-applications', auth, async (req, res) => {
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

router.delete('/delete/:id',async (req,res)=>{
  try{
    const id = req.params.id;
    const application = await Application.findByIdAndDelete(id);
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

module.exports = router;