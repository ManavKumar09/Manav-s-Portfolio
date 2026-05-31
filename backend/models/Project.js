const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String, // Array of image URLs
  }],
  githubLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
  techStack: [{
    type: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
