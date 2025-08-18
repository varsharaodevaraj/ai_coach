const express = require('express');
const { codeHelp } = require('../controllers/codeController');

const router = express.Router();

// POST /code/help → ask AI about code
router.post('/help', codeHelp);

router.get('/ping', (req, res) => {
  res.json({ message: "Code routes working 🚀" });
});

module.exports = router;