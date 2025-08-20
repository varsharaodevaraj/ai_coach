// const express = require('express');
// const { registerUser, loginUser } = require('../controllers/userController');

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// module.exports = router;

// const express = require('express');
// const { createUser, getUser } = require('../controllers/userController');

// const router = express.Router();

// router.post('/', createUser);  // this must match the exported name
// router.get('/:email', getUser);

// module.exports = router;

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
