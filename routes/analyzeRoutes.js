const express = require('express');
const router = express.Router();
const { analyzeNews } = require('../controllers/analyzeController');

// POST request ke liye route: http://localhost:5000/api/analyze
router.post('/analyze', analyzeNews);

module.exports = router;
