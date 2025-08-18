const express = require('express');
const { getHints } = require('../controllers/hintController');

const router = express.Router();

// GET /hints/:attemptId → fetch hints if time >= 15 mins
router.get('/:attemptId', getHints);

module.exports = router;