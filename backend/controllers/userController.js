const bcrypt = require('bcryptjs');
const db = require('../db');

// Yeni kullanıcı ekleme
const addUser = (req, res) => {
  const { username, role, password } = req.body;

  // Şifreyi hash'leyin
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Şifre hashlenirken hata oluştu:', err);
      return res.status(500).json({ message: 'Şifre hashlenirken bir hata oluştu.' });
    }

    // Kullanıcıyı veritabanına ekleyin
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.execute(query, [username, hashedPassword, role], (err, result) => {
      if (err) {
        console.error('Kullanıcı eklerken hata oluştu:', err);
        return res.status(500).json({ message: 'Kullanıcı ekleme sırasında bir hata oluştu.' });
      }
      res.status(201).json({ message: 'Kullanıcı başarıyla eklendi!', userId: result.insertId });
    });
  });
};

// Kullanıcıları listeleme
const getUsers = (req, res) => {
  const query = 'SELECT * FROM users';
  db.execute(query, (err, result) => {
    if (err) {
      console.error('Kullanıcıları getirirken hata oluştu:', err);
      return res.status(500).json({ message: 'Kullanıcıları getirme sırasında bir hata oluştu.' });
    }
    res.status(200).json(result);
  });
};

module.exports = { addUser, getUsers };
