const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Profile = require('../models/Profile');

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Apply auth middleware to ALL routes in this file
router.use(auth);

// --- PROJECTS ---
router.post('/projects', upload.array('images', 5), async (req, res) => {
  try {
    const projectData = { ...req.body };
    
    // Parse techStack if it was sent as a string (FormData limitation)
    if (typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch (e) {
        // Fallback if not JSON string
        projectData.techStack = projectData.techStack.split(',').map(s => s.trim()).filter(s => s);
      }
    }

    // Add uploaded file paths to images array
    if (req.files && req.files.length > 0) {
      projectData.images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    } else {
      // Allow passing existing URLs as well
      if (typeof projectData.images === 'string') {
        try {
          projectData.images = JSON.parse(projectData.images);
        } catch (e) {
          projectData.images = projectData.images.split(',').map(s => s.trim()).filter(s => s);
        }
      }
    }

    const newProject = new Project(projectData);
    const saved = await newProject.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/projects/:id', upload.array('newImages', 5), async (req, res) => {
  try {
    const projectData = { ...req.body };
    
    if (typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch (e) {
        projectData.techStack = projectData.techStack.split(',').map(s => s.trim()).filter(s => s);
      }
    }

    // Parse existing images array
    let images = [];
    if (typeof projectData.images === 'string') {
      try {
        images = JSON.parse(projectData.images);
      } catch (e) {
        images = projectData.images.split(',').map(s => s.trim()).filter(s => s);
      }
    } else if (Array.isArray(projectData.images)) {
      images = projectData.images;
    }

    // Add newly uploaded files
    if (req.files && req.files.length > 0) {
      const newUploads = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
      images = [...images, ...newUploads];
    }
    
    projectData.images = images;

    const updated = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EXPERIENCE ---
router.post('/experience', upload.single('certificate'), async (req, res) => {
  try {
    const expData = { ...req.body };
    if (req.file) {
      expData.certificateUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const newExp = new Experience(expData);
    const saved = await newExp.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/experience/:id', upload.single('certificate'), async (req, res) => {
  try {
    const expData = { ...req.body };
    if (req.file) {
      expData.certificateUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const updated = await Experience.findByIdAndUpdate(req.params.id, expData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SKILLS ---
router.post('/skills', async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    const saved = await newSkill.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/skills/:id', async (req, res) => {
  try {
    const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/skills/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROFILE ---
router.get('/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = { aboutText: 'Dummy intro text for the about section goes here for now.' };
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { aboutText } = req.body;
    let profile = await Profile.findOne();
    
    if (!profile) {
      profile = new Profile({ aboutText });
      await profile.save();
    } else {
      profile.aboutText = aboutText;
      await profile.save();
    }
    
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
