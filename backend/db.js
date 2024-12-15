const { Pool } = require('pg');

// Veritabanı bağlantısını oluştur
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Render için gerekli olabilir
  }
});

// Bağlantıyı test et
async function testConnection() {
  try {
    const client = await db.connect();
    console.log('PostgreSQL bağlantısı başarılı!');
    client.release();
  } catch (error) {
    console.error('PostgreSQL bağlantı hatası:', error);
  }
}

// Bağlantıyı test et
testConnection();

module.exports = db;
