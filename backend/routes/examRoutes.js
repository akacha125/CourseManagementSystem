const express = require('express');
const { 
    addExam, 
    getStudentInfo, 
    getAllStudentNumbers, 
    getExamDates, 
    getExamsByDate,
    getExamTypesByDate,
    getExamsByDateAndType,
    deleteExams,
    getLatestExamScores,
    getLatestExamDetails  
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

// Belirli bir tarihteki son sınavın öğrenci puanlarını getirme
router.get('/latest-exam-scores/:date', getLatestExamScores);

// Son sınavın detaylarını getirme
router.get('/latest-exam-details/:date', getLatestExamDetails);

// Sınav silme
router.post('/delete', deleteExams);

module.exports = router;
