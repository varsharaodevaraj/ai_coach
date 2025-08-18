const Attempt = require('../models/Attempt');
const Hint = require('../models/Hint');

// @desc Get available hints for an attempt (time based)
// @route GET /hints/:attemptId
async function getHints(req, res, next) {
  try {
    const attempt = await Attempt.findById(req.params.attemptId).populate('problemId');
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    // check if 15 mins have passed
    const now = new Date();
    const diffMins = Math.floor((now - attempt.createdAt) / (1000 * 60));

    if (diffMins < 15) {
      return res.json({
        available: false,
        message: `Hints unlock after 15 minutes. You have ${15 - diffMins} mins left.`
      });
    }

    // fetch stored hints (later can integrate AI if none)
    const hints = await Hint.find({ problemId: attempt.problemId._id }).sort({ level: 1 });

    res.json({
      available: true,
      hints
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHints };