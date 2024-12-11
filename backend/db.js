const mysql = require('mysql2/promise');

// Veritabanı bağlantısını oluştur
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'coursemanagement',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Bağlantıyı test et
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('MySQL bağlantısı başarılı!');
    connection.release();
  } catch (error) {
    console.error('MySQL bağlantı hatası:', error);
  }
}

// Bağlantıyı test et
testConnection();

module.exports = db;
