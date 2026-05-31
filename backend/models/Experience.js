const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectsCompleted: {
    type: Number,
    default: 0,
  },
  logoUrl: {
    type: String,
  },
  certificateUrl: {
    type: String,
  },
  githubLink: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
