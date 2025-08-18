const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  level: {
    type: Number, // 1,2,3 (progressive hints if we want later)
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hint', hintSchema);