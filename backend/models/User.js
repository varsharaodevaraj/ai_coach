const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const problemAttemptSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  timeSpent: { type: Number, default: 0 },
  hintsUsed: { type: Number, default: 0 },
  lastAttempt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }, // for authentication
  problemsAttempted: [problemAttemptSchema],
  streak: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Password hashing before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password check method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);