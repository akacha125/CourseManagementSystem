const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection string'i oluştur
const connectionString = process.env.DATABASE_URL;

// PostgreSQL bağlantısı oluştur
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
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
        console.error('Database query error:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

// Bağlantıyı test et
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL connection successful!');
        client.release();
        return true;
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
        return false;
    }
};

// İlk bağlantı testi
(async () => {
    await testConnection();
})();

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
