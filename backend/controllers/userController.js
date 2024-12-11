const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Yeni kullanıcı ekleme
const addUser = async (req, res) => {
  const {
    username,
    password,
    fullname,
    phoneNo,
    role,
    studentNo,
    class: studentClass,
    exam,
    branch
  } = req.body;

  try {
    // Şifreyi hash'leyin
    const hashedPassword = await bcrypt.hash(password, 10);

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

    await db.executeQuery(userQuery, params);
    res.status(201).json({ message: 'Kullanıcı başarıyla eklendi!' });
  } catch (err) {
    console.error('Kullanıcı eklerken hata oluştu:', err);
    res.status(500).json({ message: 'Kullanıcı ekleme sırasında bir hata oluştu.' });
  }
};

// Öğrenci Numarasının Benzersizliğini Kontrol Et
const checkStudentNoUnique = async (req, res) => {
  const { studentNo } = req.body;

  try {
    const query = 'SELECT COUNT(*) AS count FROM users WHERE studentNo = ?';
    const result = await db.executeQuery(query, [studentNo]);
    const isUnique = result[0].count === 0;
    res.status(200).json({ isUnique });
  } catch (err) {
    console.error('Öğrenci numarasını kontrol ederken hata oluştu:', err);
    res.status(500).json({ message: 'Hata oluştu.' });
  }
};

// Öğrencileri listeleme
const getStudents = async (req, res) => {
  try {
    const query = 'SELECT * FROM users WHERE role = ?'; 
    const result = await db.executeQuery(query, ['student']);
    res.status(200).json(result);
  } catch (err) {
    console.error('Öğrencileri getirirken hata oluştu:', err);
    res.status(500).json({ message: 'Öğrencileri getirme sırasında bir hata oluştu.' });
  }
};

// Öğretmenleri listeleme
const getTeachers = async (req, res) => {
  try {
    const query = 'SELECT * FROM users WHERE role = ?'; 
    const result = await db.executeQuery(query, ['teacher']);
    res.status(200).json(result);
  } catch (err) {
    console.error('Öğretmenleri getirirken hata oluştu:', err);
    res.status(500).json({ message: 'Öğretmenleri getirme sırasında bir hata oluştu.' });
  }
};

// Öğrencileri silme
const deleteStudents = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Geçersiz id listesi' });
  }

  try {
    const query = `DELETE FROM users WHERE id IN (${ids.map(() => '?').join(',')})`;
    const result = await db.executeQuery(query, ids);
    res.status(200).json({ message: `${result.affectedRows} öğrenci silindi.` });
  } catch (err) {
    console.error('Öğrencileri silerken hata oluştu:', err);
    res.status(500).json({ message: 'Silme işlemi sırasında hata oluştu.' });
  }
};

// Öğretmenleri silme
const deleteTeachers = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Geçersiz id listesi' });
  }

  try {
    const placeholders = ids.map(() => '?').join(',');
    const query = `DELETE FROM users WHERE id IN (${placeholders}) AND role = 'teacher'`;
    const result = await db.executeQuery(query, ids);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Silinecek öğretmen bulunamadı.' });
    }

    res.status(200).json({ 
      message: 'Öğretmenler başarıyla silindi',
      deletedCount: result.affectedRows 
    });
  } catch (err) {
    console.error('Öğretmenleri silerken hata oluştu:', err);
    res.status(500).json({ message: 'Öğretmenleri silme sırasında bir hata oluştu.' });
  }
};

// Tüm öğrencileri getir
const getStudentList = async (req, res) => {
  try {
    const students = await db.getStudentList();
    
    if (students.length === 0) {
      return res.status(404).json({ 
        message: 'Sistemde kayıtlı öğrenci bulunamadı' 
      });
    }

    res.json(students);
  } catch (error) {
    console.error('Öğrenci listesi alınırken hata:', error);
    res.status(500).json({ 
      message: 'Öğrenci listesi alınırken bir hata oluştu',
      error: error.message 
    });
  }
};

module.exports = { 
  addUser, 
  checkStudentNoUnique, 
  getStudents, 
  getTeachers, 
  deleteStudents, 
  deleteTeachers, 
  getStudentList 
};
