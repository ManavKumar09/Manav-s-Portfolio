const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Profile = require('../models/Profile');

// @route   GET /api/public/projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/public/experience
router.get('/experience', async (req, res) => {
  try {
    const exp = await Experience.find().sort({ createdAt: -1 });
    res.json(exp);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/public/skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/public/profile
router.get('/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = { aboutText: 'Dummy intro text for the about section goes here for now.' };
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
