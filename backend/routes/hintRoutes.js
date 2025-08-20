const express = require('express');
const { getHintsForAttempt } = require('../controllers/hintController');
const router = express.Router();

router.get('/attempt/:attemptId', getHintsForAttempt);

module.exports = router;
