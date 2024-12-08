const express = require('express');
const { addUser, getStudents, getTeachers, getParents } = require('../controllers/userController');

const router = express.Router();

// Kullanıcı ekleme
router.post('/add-user', addUser);

// Öğrencileri listeleme
router.get('/students', getStudents);

// Öğretmenleri listeleme
router.get('/teachers', getTeachers);

// Velileri listeleme
router.get('/parents', getParents);

module.exports = router;
