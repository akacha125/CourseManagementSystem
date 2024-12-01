const db = require('../db'); // MySQL bağlantısı

// Yeni kurs ekleme
const addCourse = (req, res) => {
  const { name, description} = req.body;
  
  const query = 'INSERT INTO courses (name, description) VALUES (?, ?)';
  db.execute(query, [name, description], (err, result) => {
    if (err) {
      console.error('Ders eklerken hata oluştu:', err);
      return res.status(500).json({ message: 'Ders ekleme sırasında bir hata oluştu.' });
    }
    res.status(201).json({ message: 'Ders başarıyla eklendi!', courseId: result.insertId });
  });
};

// Tüm kursları listeleme
const getCourses = (req, res) => {
  const query = 'SELECT * FROM courses';
  db.execute(query, (err, result) => {
    if (err) {
      console.error('Kursları getirirken hata oluştu:', err);
      return res.status(500).json({ message: 'Kursları getirme sırasında bir hata oluştu.' });
    }
    res.status(200).json(result);
  });
};

module.exports = { addCourse, getCourses };
