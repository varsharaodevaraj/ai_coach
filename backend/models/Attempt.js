const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema({
  hintText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, default: '' },
  timeSpent: { type: Number, default: 0 },
  usedHints: { type: Boolean, default: false },
  hintHistory: [hintSchema],
  status: { type: String, enum: ['in-progress', 'solved', 'unsolved'], default: 'in-progress' },
  startTime: { type: Date, default: Date.now },
  needsRevision: { type: Boolean, default: false }, // ✅ for daily reminders
  reminderSent: { type: Boolean, default: false },  // ✅ to avoid duplicate emails
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  feedback: { type: String, default: "" }, // AI feedback / improvement suggestions
  testResults: { type: Array, default: [] }
});

// keep updatedAt fresh on save
attemptSchema.pre('save', function (next) {
  this.updatedAt = new Date();

  // flag revision if user struggled
  if (this.usedHints || this.timeSpent >= 25) {
    this.needsRevision = true;
  }

  next();
});

module.exports = mongoose.model('Attempt', attemptSchema);