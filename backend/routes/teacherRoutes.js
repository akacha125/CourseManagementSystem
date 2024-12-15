const express = require('express');
const router = express.Router();
const { getTeachers, deleteTeachers } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Öğretmenleri listele
router.get('/', auth, getTeachers);

// Öğretmenleri sil
router.delete('/', auth, deleteTeachers);

module.exports = router;
