const Attempt = require('../models/Attempt');
const Problem = require('../models/Problem');
const { askAI } = require('../utils/ollamaClient');
const { runTests } = require('../utils/codeRunner');

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

async function updateAttempt(req, res, next) {
  try {
    const { timeSpent, code, usedHints, status } = req.body;

    const update = { timeSpent, code, usedHints, status };

    // ✅ flag revision if needed
    if ((timeSpent && timeSpent >= 25) || usedHints === true) {
      update.needsRevision = true;
    }

    const attempt = await Attempt.findByIdAndUpdate(
      req.params.id,
      update,
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

async function getRevisionAttempts(req, res, next) {
  try {
    const { userId } = req.params;

    // yesterday range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(today);
    yesterdayStart.setDate(today.getDate() - 1);

    const yesterdayEnd = new Date(today);

    const attempts = await Attempt.find({
      userId,
      needsRevision: true,             // ✅ much simpler now
      status: { $ne: 'solved' },
      createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd }
    }).populate('problemId', 'title difficulty platform tags');

    res.json({ attempts });
  } catch (err) {
    next(err);
  }
}

// @desc Submit attempt with code evaluation + AI feedback
// @route POST /attempts/:id/submit
async function submitAttempt(req, res, next) {
  try {
    const { code } = req.body;
    const attempt = await Attempt.findById(req.params.id).populate('problemId');

    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    // Run tests (utils/codeRunner.js)
    const results = await runTests(code, attempt.problemId.testCases);

    let status = results.every(r => r.pass) ? "solved" : "unsolved";

    // Ask Ollama for feedback
    let feedbackPrompt = status === "solved"
      ? `Problem: ${attempt.problemId.title}\nUser Code:\n${code}\nThe code passes all tests. Is it optimal? Suggest improvements.`
      : `Problem: ${attempt.problemId.title}\nUser Code:\n${code}\nThe code failed tests: ${JSON.stringify(results)}\nIdentify bugs and suggest fixes.`

    const feedback = await askAI(feedbackPrompt);

    attempt.code = code;
    attempt.status = status;
    attempt.testResults = results;
    attempt.feedback = feedback;
    await attempt.save();

    res.json({ status, results, feedback });
  } catch (err) {
    next(err);
  }
}

// @desc Get analytics for a user's attempts
// @route GET /attempts/user/:userId/analytics
async function getUserAnalytics(req, res, next) {
  try {
    const { userId } = req.params;
    const attempts = await Attempt.find({ userId }).populate('problemId', 'difficulty tags createdAt');

    // Example analytics: problems solved per day, avg time, topic breakdown
    const solvedAttempts = attempts.filter(a => a.status === 'solved');
    const problemsPerDay = {};
    const topicCount = {};
    let totalTime = 0;

    solvedAttempts.forEach(a => {
      const day = a.createdAt.toISOString().slice(0, 10);
      problemsPerDay[day] = (problemsPerDay[day] || 0) + 1;
      totalTime += a.timeSpent || 0;
      if (a.problemId.tags) {
        a.problemId.tags.forEach(tag => {
          topicCount[tag] = (topicCount[tag] || 0) + 1;
        });
      }
    });

    const avgTime = solvedAttempts.length ? (totalTime / solvedAttempts.length) : 0;

    res.json({
      solvedCount: solvedAttempts.length,
      problemsPerDay,
      avgTime,
      topicCount
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  startAttempt,
  updateAttempt,
  getAttemptsByUser,
  getRevisionAttempts,
  submitAttempt,
  getUserAnalytics
};