const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'coursemanagement',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
    process.exit(1);
  }
  console.log('MySQL bağlantısı başarılı!');
});

module.exports = db;
