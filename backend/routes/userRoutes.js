const express = require('express');
const { getHintsForAttempt } = require('../controllers/hintController');
const { createUser, loginUser, getUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /hints/attempt/:attemptId → progressive hints for attempt
router.get('/attempt/:attemptId', getHintsForAttempt);

// User routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/me', protect, getUser);

module.exports = router;
