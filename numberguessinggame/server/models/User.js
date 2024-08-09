

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  secretNumber: {
    type: String,
    required: true,
  },
  guesses: {
    type: Number,
    required: true,
    default: 0,
  },
  bestScore: {
    type: Number,
    required: true,
    default: Infinity,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
