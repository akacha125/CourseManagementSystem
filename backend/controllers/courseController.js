const db = require('../db');

// Tüm kursları listeleme
const getCourses = async (req, res) => {
  try {
    const result = await db.executeQuery('SELECT * FROM courses ORDER BY id ASC', []);
    res.json(result);
  } catch (err) {
    console.error('Kursları getirirken hata oluştu:', err);
    res.status(500).json({ message: 'Kursları getirme sırasında bir hata oluştu.' });
  }
};

// Yeni kurs ekleme
const addCourse = async (req, res) => {
  const { name, description, instructor, price } = req.body;
  
  try {
    const result = await db.executeQuery(
      'INSERT INTO courses (name, description, instructor, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, instructor, price]
    );
    res.status(201).json(result[0]);
  } catch (err) {
    console.error('Ders eklerken hata oluştu:', err);
    res.status(500).json({ message: 'Ders ekleme sırasında bir hata oluştu.' });
  }
};

module.exports = { addCourse, getCourses };
