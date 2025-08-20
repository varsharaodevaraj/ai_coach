const Problem = require('../models/Problem');

// @desc Add a new problem
// @route POST /problems
async function addProblem(req, res, next) {
  try {
    console.log("REQ BODY RECEIVED:", req.body);
    const { title, description, platform, difficulty, tags, link } = req.body;

    if (!title || !difficulty) {
      return res.status(400).json({ error: 'Title and difficulty are required' });
    }

    const problem = await Problem.create({ title, description, platform, difficulty, tags, link });
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

// ✅ New: Get similar problems
// @desc Get similar problems based on tags & difficulty
// @route GET /problems/similar/:problemId
async function getSimilarProblems(req, res, next) {
  try {
    const { problemId } = req.params;

    const currentProblem = await Problem.findById(problemId);
    if (!currentProblem) return res.status(404).json({ error: 'Problem not found' });

    const similar = await Problem.find({
      _id: { $ne: problemId },
      $or: [
        { difficulty: currentProblem.difficulty },
        { tags: { $in: currentProblem.tags } }
      ]
    }).limit(5);

    res.json({ similar });
  } catch (err) {
    next(err);
  }
}

module.exports = { addProblem, getProblems, getProblemById, getSimilarProblems };