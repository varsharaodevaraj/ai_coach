const Problem = require('../models/Problem');

// @desc Add a new problem
// @route POST /problems
async function addProblem(req, res, next) {
  try {
    const { title, platform, difficulty, tags, link } = req.body;

    if (!title || !difficulty) {
      return res.status(400).json({ error: 'Title and difficulty are required' });
    }

    const problem = await Problem.create({ title, platform, difficulty, tags, link });
    res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
}

// @desc Get all problems
// @route GET /problems
async function getProblems(_req, res, next) {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    next(err);
  }
}

// @desc Get a single problem by ID
// @route GET /problems/:id
async function getProblemById(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    next(err);
  }
}

module.exports = { addProblem, getProblems, getProblemById };