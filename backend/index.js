require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');  // Yeni eklenen satır

const app = express();

// CORS ayarları
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://coursemanagementsystem-1.onrender.com',
  credentials: true
}));

app.use(express.json());

// Rotalar
app.use('/api', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', userRoutes);
app.use('/api', examRoutes);  // Yeni eklenen satır

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
