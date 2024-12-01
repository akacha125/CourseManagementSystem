require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../db');
const jwt = require('jsonwebtoken'); // JWT modülü

const login = (req, res) => {
  const { username, password } = req.body;

  // Veritabanında kullanıcıyı sorgula
  const query = 'SELECT * FROM users WHERE username = ?';
  db.execute(query, [username], (err, result) => {
    if (err) {
      console.error('Giriş işlemi sırasında hata oluştu:', err);
      return res.status(500).json({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Veritabanındaki şifreyi kontrol et
    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Şifre karşılaştırma hatası:', err);
        return res.status(500).json({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
      }

      // Şifre eşleşti, token oluştur
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token });
    });
  });
};

module.exports = { login };

