const Attempt = require('../models/Attempt');
const Problem = require('../models/Problem');
const { runOllama } = require('../services/aiService'); // or your AI client

// @desc Get progressive AI hints for an attempt
// @route GET /hints/attempt/:attemptId
async function getHintsForAttempt(req, res, next) {
  try {
    const { attemptId } = req.params;
    const { action } = req.query;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    if (action === 'stop') {
      attempt.hintsStopped = true;
      await attempt.save();
      return res.json({ message: 'Hints stopped for this attempt.' });
    }

    if (attempt.hintsStopped) {
      return res.json({ message: 'Hints have been stopped for this attempt.' });
    }

    const problem = await Problem.findById(attempt.problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    // Calculate time spent
    const now = new Date();
    const minutesSpent = Math.floor((now - attempt.createdAt) / 60000);

    // Reveal answer/approach if requested
    if (action === 'reveal') {
      const prompt = `Give a full solution and approach for the following coding problem:\n${problem.title}\n${problem.description}`;
      const solution = await runOllama("llama3", prompt);
      return res.json({ solution });
    }

    // Progressive AI hint logic
    let hintLevel = 0;
    if (minutesSpent >= 25) {
      hintLevel = 1 + Math.floor((minutesSpent - 25) / 5);
    }

    if (hintLevel === 0) {
      return res.json({ message: 'Hints provided after 25min:) Meanwhile, Think..', minutesSpent });
    }

    // Generate hint prompt based on level
    let hintPrompt = `Give a hint (level ${hintLevel}) for the following coding problem. Do not give the solution, just a nudge or concept:\n${problem.title}\n${problem.description}`;
    const hint = await runOllama("llama3", hintPrompt);

    res.json({ hint, hintLevel, minutesSpent });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHintsForAttempt };