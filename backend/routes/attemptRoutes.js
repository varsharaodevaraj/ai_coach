const express = require('express');
const { startAttempt, updateAttempt, getAttemptsByUser, getRevisionAttempts, getUserAnalytics } = require('../controllers/attemptController');

const router = express.Router();

// POST /attempts → start new attempt
router.post('/', startAttempt);

// PUT /attempts/:id → update attempt
router.put('/:id', updateAttempt);

// GET /attempts/user/:userId → get all attempts by user
router.get('/user/:userId', getAttemptsByUser);

// GET /attempts/revision/:userId → get revision reminders
router.get('/revision/:userId', getRevisionAttempts);

// GET /attempts/user/:userId/analytics → get user analytics
router.get('/user/:userId/analytics', getUserAnalytics);

module.exports = router;