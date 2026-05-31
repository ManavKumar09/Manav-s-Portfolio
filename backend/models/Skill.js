const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  techStack: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String, 
    required: true,
    default: 'Code' // Default lucide-react icon
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
