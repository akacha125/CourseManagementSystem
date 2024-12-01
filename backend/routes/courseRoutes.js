const express = require('express');
const { addCourse, getCourses } = require('../controllers/courseController');

const router = express.Router();

// Kurs ekleme
router.post('/add-course', addCourse);

// Tüm kursları listeleme
router.get('/courses', getCourses);

module.exports = router;
