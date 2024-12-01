const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Basit bir giriş endpoint'i
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Örnek kullanıcı (gerçek veri tabanından alman gerekiyor)
  const user = { id: 1, username: 'admin', password: await bcrypt.hash('123456', 10), role: 'admin' };

  // Kullanıcı doğrulama
  if (username !== user.username || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Hatalı kullanıcı adı veya şifre');
  }

  // JWT token oluşturma
  const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
  res.send({ token });
});

// Ana sayfa
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

