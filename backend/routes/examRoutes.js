const express = require('express');
const { addExam, getStudentInfo, getAllStudentNumbers } = require('../controllers/examController');

const router = express.Router();

// Yeni sınav sonucu ekleme
router.post('/add-exam', addExam);

// Öğrenci numarasına göre öğrenci bilgilerini getirme
router.get('/student-info/:studentNo', getStudentInfo);

// Tüm öğrenci numaralarını getirme
router.get('/student-numbers', getAllStudentNumbers);

module.exports = router;
