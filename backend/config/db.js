const { Pool } = require('pg');
require('dotenv').config();

let pool;

try {
    // Render'ın sağladığı DATABASE_URL'i kullan
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        },
        // Bağlantı havuzu ayarları
        max: 20, // maksimum bağlantı sayısı
        idleTimeoutMillis: 30000, // boşta kalma süresi
        connectionTimeoutMillis: 2000 // bağlantı zaman aşımı
    });

    console.log('PostgreSQL pool created successfully');
} catch (error) {
    console.error('Error creating PostgreSQL pool:', error);
    process.exit(1); // Kritik hata, uygulamayı sonlandır
}

// Genel sorgu çalıştırma fonksiyonu
const executeQuery = async (query, params = []) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

// Bağlantıyı test et
const testConnection = async () => {
    let client;
    try {
        client = await pool.connect();
        await client.query('SELECT NOW()');
        console.log('PostgreSQL connection test successful');
        return true;
    } catch (error) {
        console.error('PostgreSQL connection test failed:', error);
        return false;
    } finally {
        if (client) {
            client.release();
        }
    }
};

// Uygulama başladığında bağlantıyı test et
(async () => {
    try {
        await testConnection();
    } catch (error) {
        console.error('Initial connection test failed:', error);
    }
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
    getStudentInfo,
    testConnection
};
