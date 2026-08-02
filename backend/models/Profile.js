const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  aboutText: {
    type: String,
    default: 'A passionate MERN stack developer crafting bold and memorable projects.'
  },
  resumeUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
