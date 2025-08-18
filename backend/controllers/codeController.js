const { runOllama } = require('../services/aiService');

// @desc Ask AI about code step by step
// @route POST /code/help
async function codeHelp(req, res, next) {
  try {
    const { code, question, revealSolution } = req.body;

    if (!code || !question) {
      return res.status(400).json({ error: 'Code and question are required' });
    }

    let prompt;
    if (revealSolution) {
      // user explicitly asked for full solution
      prompt = `The user wrote this code:\n${code}\nThey now want the full correct solution. Provide the full working corrected code.`;
    } else {
      // step-by-step guidance mode
      prompt = `The user wrote this code:\n${code}\nThey asked: ${question}\n
      Please respond step by step, guiding them without directly giving the final full solution unless they ask explicitly.`;
    }

    const response = await runOllama("codellama", prompt);

    res.json({ response });
  } catch (err) {
    next(err);
  }
}

module.exports = { codeHelp };