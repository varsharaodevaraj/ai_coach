const express = require('express');
const { startAttempt, updateAttempt, getAttemptsByUser } = require('../controllers/attemptController');

const router = express.Router();

// POST /attempts → start new attempt
router.post('/', startAttempt);

// PUT /attempts/:id → update attempt
router.put('/:id', updateAttempt);

// GET /attempts/user/:userId → get all attempts by user
router.get('/user/:userId', getAttemptsByUser);

module.exports = router;