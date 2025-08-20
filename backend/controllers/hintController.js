const Attempt = require('../models/Attempt');
const Hint = require('../models/Hint');

// @desc Get progressive hints for an attempt
// @route GET /hints/attempt/:attemptId
async function getHintsForAttempt(req, res, next) {
  try {
    const { attemptId } = req.params;
    const attempt = await Attempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    // Find all hints for the problem
    const hints = await Hint.find({ problemId: attempt.problemId }).sort({ level: 1 });

    // Calculate time spent
    const now = new Date();
    const minutesSpent = Math.floor((now - attempt.createdAt) / 60000);

    // Progressive unlock logic
    let unlockedLevel = 1;
    if (minutesSpent >= 10) unlockedLevel = 2;
    if (minutesSpent >= 20) unlockedLevel = 3;

    // Filter hints by unlocked level
    const unlockedHints = hints.filter(h => h.level <= unlockedLevel);

    res.json({ unlockedHints, minutesSpent });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHintsForAttempt };