const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL bağlantı havuzu oluştur
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'coursemanagement',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Genel sorgu çalıştırma fonksiyonu
const executeQuery = async (query, params = []) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.execute(query, params);
        return results;
    } catch (error) {
        console.error('Veritabanı sorgu hatası:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

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
        WHERE studentNo = ? AND role = 'student'
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
