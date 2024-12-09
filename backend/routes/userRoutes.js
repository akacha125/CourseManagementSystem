const express = require('express');
const { addUser, checkStudentNoUnique, getStudents, getTeachers } = require('../controllers/userController');

const router = express.Router();

// Kullanıcı ekleme
router.post('/add-user', addUser);

// Öğrenci no aynı olmasın diye
router.post('/check-student-no', checkStudentNoUnique);

// Öğrencileri listeleme
router.get('/students', getStudents);

// Öğretmenleri listeleme
router.get('/teachers', getTeachers);

module.exports = router;
