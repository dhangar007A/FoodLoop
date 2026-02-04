const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true, 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
  },
  profilePicture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 150,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  }
}, { 
  timestamps: true 
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;