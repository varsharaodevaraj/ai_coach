const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // we'll add User model later
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String, // user’s submitted code
    default: ''
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  usedHints: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['in-progress', 'solved', 'unsolved'],
    default: 'in-progress'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// update updatedAt whenever attempt is saved
attemptSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Attempt', attemptSchema);