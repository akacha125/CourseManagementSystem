const express = require('express');
const { addUser, checkStudentNoUnique, getStudents, getTeachers, deleteStudents, deleteTeachers, getStudentList } = require('../controllers/userController');

const router = express.Router();

// Kullanıcı ekleme
router.post('/add-user', addUser);

// Öğrenci no aynı olmasın diye
router.post('/check-student-no', checkStudentNoUnique);

// Öğrencileri listeleme
router.get('/students', getStudents);

// Öğrenci listeleme
router.get('/student-list', getStudentList);

// Öğretmenleri listeleme
router.get('/teachers', getTeachers);

//Ögrencileri silme
router.post('/deleteStudents', deleteStudents);

//Öğretmenleri silme
router.post('/deleteTeachers', deleteTeachers);

module.exports = router;
