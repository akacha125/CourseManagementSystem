const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL bağlantısı oluştur
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // Render için gerekli
    sslmode: 'require'
  }
});

// Genel sorgu çalıştırma fonksiyonu
const executeQuery = async (query, params = []) => {
    let connection;
    try {
        connection = await pool.connect();
        const { rows } = await connection.query(query, params);
        return rows;
    } catch (error) {
        console.error('Veritabanı sorgu hatası:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

// Bağlantıyı test et
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL bağlantısı başarılı!');
        client.release();
    } catch (error) {
        console.error('PostgreSQL bağlantı hatası:', error);
    }
};

testConnection();

// Öğrenci listesi getirme
const getStudentList = async () => {
    const query = `
        SELECT id, studentNo, fullname, class
        FROM users
        WHERE role = 'student'
        ORDER BY fullname
    `;
    return await executeQuery(query);
};

// Öğrenci bilgisi getirme
const getStudentInfo = async (studentNo) => {
    const query = `
        SELECT *
        FROM users
        WHERE studentNo = $1 AND role = 'student'
    `;
    const results = await executeQuery(query, [studentNo]);
    return results[0] || null;
};

module.exports = {
    pool,
    executeQuery,
    getStudentList,
    getStudentInfo
};
