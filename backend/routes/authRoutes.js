const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Login endpoint
router.post('/login', login);

module.exports = router;
