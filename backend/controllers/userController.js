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
    // Öğrenci alanları
    studentNo,
    class: studentClass,
    yearlyFee,
    // Öğretmen alanları
    branch,
    salary,
    // Veli alanları
    childFullname,
    childSchoolNo,
    address,
    childYearlyFee,
  } = req.body;

  // Şifreyi hash'leyin
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Şifre hashlenirken hata oluştu:', err);
      return res.status(500).json({ message: 'Şifre hashlenirken bir hata oluştu.' });
    }

    // Kullanıcıyı Users tablosuna ekleyin
    const userQuery = `
      INSERT INTO users (username, password, fullname, phoneNo, role, studentNo, class, yearlyFee, branch, salary, childFullname, childSchoolNo, address, childYearlyFee) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      yearlyFee || null,  // Eğer öğrenci rolü değilse null
      branch || null,  // Eğer öğretmen rolü değilse null
      salary || null,  // Eğer öğretmen rolü değilse null
      childFullname || null,  // Eğer veli rolü değilse null
      childSchoolNo || null,  // Eğer veli rolü değilse null
      address || null,  // Eğer veli rolü değilse null
      childYearlyFee || null  // Eğer veli rolü değilse null
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
