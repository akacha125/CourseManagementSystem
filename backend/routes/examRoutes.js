const express = require('express');
const { addExam, getStudentInfo, getAllStudentNumbers, getExamDates, getExamsByDate } = require('../controllers/examController');

const router = express.Router();

// Yeni sınav sonucu ekleme
router.post('/add-exam', addExam);

// Öğrenci numarasına göre öğrenci bilgilerini getirme
router.get('/student-info/:studentNo', getStudentInfo);

// Tüm öğrenci numaralarını getirme
router.get('/student-numbers', getAllStudentNumbers);

// Sınav tarihlerini getirme
router.get('/dates', getExamDates);

// Belirli bir tarihe göre sınavları getirme
router.get('/by-date/:date', getExamsByDate);

module.exports = router;
