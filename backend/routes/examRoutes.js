const express = require('express');
const { 
    addExam, 
    getStudentInfo, 
    getAllStudentNumbers, 
    getExamDates, 
    getExamsByDate,
    getExamTypesByDate,
    getExamsByDateAndType 
} = require('../controllers/examController');

const router = express.Router();

// Yeni sınav sonucu ekleme
router.post('/add-exam', addExam);

// Öğrenci numarasına göre öğrenci bilgilerini getirme
router.get('/student-info/:studentNo', getStudentInfo);

// Tüm öğrenci numaralarını getirme
router.get('/student-numbers', getAllStudentNumbers);

// Sınav tarihlerini getirme
router.get('/dates', getExamDates);

// Belirli bir tarihteki sınav türlerini getirme
router.get('/exam-types/:date', getExamTypesByDate);

// Belirli bir tarih ve türdeki sınavları getirme
router.get('/by-date/:date/:examType', getExamsByDateAndType);

module.exports = router;
