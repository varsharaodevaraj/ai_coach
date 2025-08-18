const Attempt = require('../models/Attempt');

// @desc Start a new attempt
// @route POST /attempts
async function startAttempt(req, res, next) {
  try {
    const { userId, problemId } = req.body;

    if (!userId || !problemId) {
      return res.status(400).json({ error: 'userId and problemId are required' });
    }

    const attempt = await Attempt.create({ userId, problemId });
    res.status(201).json(attempt);
  } catch (err) {
    next(err);
  }
}

// @desc Update attempt with progress (time, code, hint usage)
// @route PUT /attempts/:id
async function updateAttempt(req, res, next) {
  try {
    const { timeSpent, code, usedHints, status } = req.body;
    const attempt = await Attempt.findByIdAndUpdate(
      req.params.id,
      { timeSpent, code, usedHints, status },
      { new: true }
    );
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    res.json(attempt);
  } catch (err) {
    next(err);
  }
}

// @desc Get all attempts by a user
// @route GET /attempts/user/:userId
async function getAttemptsByUser(req, res, next) {
  try {
    const attempts = await Attempt.find({ userId: req.params.userId })
      .populate('problemId', 'title difficulty platform')
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err) {
    next(err);
  }
}

module.exports = { startAttempt, updateAttempt, getAttemptsByUser };