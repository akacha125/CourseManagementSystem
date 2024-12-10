const bcrypt = require('bcryptjs');
const db = require('../db');

// Yeni kullanıcı ekleme
const addUser = (req, res) => {
  const {
    username,
    password,
    role,
    fullname,
    phoneNo,
    studentNo,
    class: studentClass,
    exam,
    branch
  } = req.body;

  // Şifreyi hash'leyin
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Şifre hashlenirken hata oluştu:', err);
      return res.status(500).json({ message: 'Şifre hashlenirken bir hata oluştu.' });
    }

    // Kullanıcıyı Users tablosuna ekleyin
    const userQuery = `
      INSERT INTO users (username, password, fullname, phoneNo, role, studentNo, exam, class, branch) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Parametreler
    const params = [
      username,
      hashedPassword,
      fullname,
      phoneNo,
      role,
      studentNo || null,  // Eğer öğrenci rolü değilse null
      studentClass || null,  // Eğer öğrenci rolü değilse null
      exam || null,  // Eğer öğrenci rolü değilse null
      branch || null,  // Eğer öğretmen rolü değilse null
    ];

    db.execute(userQuery, params, (err, result) => {
      if (err) {
        console.error('Kullanıcı eklerken hata oluştu:', err);
        return res.status(500).json({ message: 'Kullanıcı ekleme sırasında bir hata oluştu.' });
      }
      
      res.status(201).json({ message: 'Kullanıcı başarıyla eklendi!' });
    });
  });
};

// Öğrenci Numarasının Benzersizliğini Kontrol Et
const checkStudentNoUnique = (req, res) => {
  const { studentNo } = req.body;

  const query = 'SELECT COUNT(*) AS count FROM users WHERE studentNo = ?';
  db.execute(query, [studentNo], (err, result) => {
    if (err) {
      console.error('Öğrenci numarasını kontrol ederken hata oluştu:', err);
      return res.status(500).json({ message: 'Hata oluştu.' });
    }

    // Benzersiz olup olmadığını kontrol et
    const isUnique = result[0].count === 0;
    res.status(200).json({ isUnique });
  });
};


// Öğrencileri listeleme
const getStudents = (req, res) => {
  const query = 'SELECT * FROM users WHERE role = ?'; 
  db.execute(query, ['student'], (err, result) => {
    if (err) {
      console.error('Öğrencileri getirirken hata oluştu:', err);
      return res.status(500).json({ message: 'Öğrencileri getirme sırasında bir hata oluştu.' });
    }
    res.status(200).json(result);
  });
};

// Öğretmenleri listeleme
const getTeachers = (req, res) => {
  const query = 'SELECT * FROM users WHERE role = ?'; 
  db.execute(query, ['teacher'], (err, result) => {
    if (err) {
      console.error('Öğretmenleri getirirken hata oluştu:', err);
      return res.status(500).json({ message: 'Öğretmenleri getirme sırasında bir hata oluştu.' });
    }
    res.status(200).json(result);
  });
};

// Öğrencileri silme
const deleteStudents = (req, res) => {
  const { ids } = req.body; // Gelen id'ler

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Silinecek öğrenci seçilmedi.' });
  }

  const query = `DELETE FROM users WHERE id IN (${ids.map(() => '?').join(',')})`;

  db.execute(query, ids, (err, result) => {
    if (err) {
      console.error('Öğrencileri silerken hata oluştu:', err);
      return res.status(500).json({ message: 'Silme işlemi sırasında hata oluştu.' });
    }

    res.status(200).json({ message: `${result.affectedRows} öğrenci silindi.` });
  });
};


module.exports = { addUser, checkStudentNoUnique, getStudents, getTeachers, deleteStudents  };
