const express = require('express');
const {
  addProblem,
  getProblems,
  getProblemById,
  getSimilarProblems
} = require('../controllers/problemController');

const router = express.Router();

// POST /problems → add new problem
router.post('/', addProblem);

// GET /problems → get all problems
router.get('/', getProblems);

// ✅ GET /problems/similar/:problemId → get similar problems
router.get('/similar/:problemId', getSimilarProblems);


// GET /problems/:id → get single problem
router.get('/:id', getProblemById);



module.exports = router;