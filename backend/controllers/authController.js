require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken'); // JWT modülü

const login = async (req, res) => {
  console.log('Login request received:', req.body); // Log incoming request

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir' });
  }

  try {
    // Veritabanında kullanıcıyı sorgula
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await db.executeQuery(query, [username]);

    console.log('Database query result:', result); // Log database query result

    if (result.length === 0) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Veritabanındaki şifreyi kontrol et
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Şifre eşleşti, token oluştur
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret', // Fallback secret key
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error('Giriş işlemi sırasında hata oluştu:', err);
    res.status(500).json({ 
      message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      error: err.message 
    });
  }
};

module.exports = { login };
