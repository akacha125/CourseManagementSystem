const db = require('../config/db'); // PostgreSQL bağlantısı

// Yeni kurs ekleme
const addCourse = async (req, res) => {
  const { name, description } = req.body;
  
  const query = 'INSERT INTO courses (name, description) VALUES ($1, $2) RETURNING id';
  try {
    const result = await db.query(query, [name, description]);
    res.status(201).json({ message: 'Ders başarıyla eklendi!', courseId: result.rows[0].id });
  } catch (err) {
    console.error('Ders eklerken hata oluştu:', err);
    res.status(500).json({ message: 'Ders ekleme sırasında bir hata oluştu.' });
  }
};

// Tüm kursları listeleme
const getCourses = async (req, res) => {
  const query = 'SELECT * FROM courses';
  try {
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Kursları getirirken hata oluştu:', err);
    res.status(500).json({ message: 'Kursları getirme sırasında bir hata oluştu.' });
  }
};

module.exports = { addCourse, getCourses };
