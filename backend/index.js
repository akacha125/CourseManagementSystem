const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL bağlantısı oluştur
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // MySQL kullanıcı adı
  password: 'root', // MySQL şifreniz
  database: 'coursemanagement',
});

// Bağlantıyı kontrol et
db.connect((err) => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
    process.exit(1);
  }
  console.log('MySQL bağlantısı başarılı!');
});

// Backend login kontrolü
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err);
      return res.status(500).send('Kullanıcı kontrolü sırasında bir hata oluştu');
    }
    if (results.length === 0) {
      console.log('Kullanıcı bulunamadı:', username);
      return res.status(401).send('Hatalı kullanıcı adı veya şifre');
    }

    const user = results[0];
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('Yanlış şifre');
      return res.status(401).send('Hatalı kullanıcı adı veya şifre');
    }

    console.log('Şifre doğru');
    const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
    res.send({ token });
  });
});



// Middleware - Yetki kontrolü
function authorize(role) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Yetkisiz erişim');
    try {
      const decoded = jwt.verify(token, 'SECRET_KEY');
      if (decoded.role !== role) return res.status(403).send('Yetkisiz erişim');
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).send('Geçersiz token');
    }
  };
}

// Kullanıcıları listeleme
app.get('/users', authorize('admin'), (req, res) => {
  db.query('SELECT id, username, role, created_at FROM users', (err, results) => {
    if (err) {
      console.error('Kullanıcılar alınırken hata:', err);
      return res.status(500).send('Kullanıcılar alınırken bir hata oluştu');
    }
    res.json(results);
  });
});

// Kullanıcı ekleme
app.post('/add-user', async (req, res) => {
  const { username, password, role } = req.body;

  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash(password, 10);

  // Kullanıcıyı veritabanına ekle
  db.query(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role],
    (err, result) => {
      if (err) {
        console.error('Kullanıcı eklenirken hata:', err);
        return res.status(500).send('Kullanıcı eklenirken bir hata oluştu');
      }
      res.status(201).send('Kullanıcı başarıyla eklendi');
    }
  );
});

// Ana sayfa
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
