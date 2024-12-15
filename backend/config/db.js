const { Pool } = require('pg');
require('dotenv').config();

let pool;

try {
    // Önce DATABASE_URL'i kontrol et, yoksa diğer env variables'ları kullan
    const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    
    console.log('Attempting to connect to PostgreSQL with:', {
        usingConnectionString: !!process.env.DATABASE_URL,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    pool = new Pool({
        connectionString: connectionString,
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
        } : false,
        // Bağlantı havuzu ayarları
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    });

    console.log('PostgreSQL pool created successfully');
} catch (error) {
    console.error('Error creating PostgreSQL pool:', error);
    // Hata durumunda uygulamayı sonlandırma, sadece loglama yap
    console.error('Database connection failed, but application will continue');
}

// Genel sorgu çalıştırma fonksiyonu
const executeQuery = async (query, params = []) => {
    if (!pool) {
        throw new Error('Database pool not initialized');
    }

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
    if (!pool) {
        console.error('Database pool not initialized');
        return false;
    }

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
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('Initial database connection test failed');
        }
    } catch (error) {
        console.error('Error during initial connection test:', error);
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
