const express = require('express');
const router = express.Router();
const { getStudents, deleteStudents, getStudentList } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Öğrenci listesini getir
router.get('/', auth, getStudents);

// Detaylı öğrenci listesini getir
router.get('/list', auth, getStudentList);

// Öğrencileri sil
router.delete('/', auth, deleteStudents);

module.exports = router;
