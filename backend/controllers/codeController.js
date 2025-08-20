const { runOllama } = require('../services/aiService');
const Attempt = require('../models/Attempt');

const codeHelp = async (req, res, next) => {
  try {
    const { userId, problemId, code, question } = req.body;

    if (!userId || !problemId || !code || !question) {
      return res.status(400).json({ error: 'userId, problemId, code, and question are required' });
    }

    // Find or create attempt
    let attempt = await Attempt.findOne({ userId, problemId });
    if (!attempt) {
      attempt = await Attempt.create({ userId, problemId, code });
    }

    const now = new Date();
    const elapsedMinutes = (now - attempt.startTime) / 1000 / 60;

    if (elapsedMinutes < 15) {
      return res.json({
        message: `Please try on your own for ${Math.ceil(15 - elapsedMinutes)} more minutes before asking a hint.`
      });
    }

    // Run AI to generate hint
    const aiHint = await runOllama(
      'codellama',
      `User code:\n${code}\nQuestion:\n${question}`
    );

    // Store hint in attempt
    attempt.hintHistory.push({ hintText: aiHint });
    attempt.code = code;
    attempt.usedHints = true;
    await attempt.save();

    res.json({
      response: aiHint,
      attemptId: attempt._id,
      totalHintsUsed: attempt.hintHistory.length
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = { codeHelp };