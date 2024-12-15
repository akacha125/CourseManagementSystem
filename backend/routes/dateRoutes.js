const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Sınav tarihlerini getir
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.executeQuery(`
            SELECT 
                e.id,
                e.course_id,
                c.name as course_name,
                e.exam_date,
                e.created_at
            FROM exams e
            INNER JOIN courses c ON e.course_id = c.id
            ORDER BY e.exam_date DESC
        `, []);
        res.json(result);
    } catch (error) {
        console.error('Sınav tarihleri getirme hatası:', error);
        res.status(500).json({ message: 'Sınav tarihleri alınırken bir hata oluştu' });
    }
});

module.exports = router;
