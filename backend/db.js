const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection string'i kullan
const connectionString = process.env.DATABASE_URL;

// PostgreSQL bağlantısı oluştur
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// Bağlantıyı test et
const testConnection = async () => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Database connection test successful:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    } finally {
        if (client) {
            client.release();
        }
    }
};

// Sorgu çalıştırma fonksiyonu
const executeQuery = async (text, params) => {
    const start = Date.now();
    let client;
    
    try {
        client = await pool.connect();
        const result = await client.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query:', { text, duration, rows: result.rowCount });
        return result.rows;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

// İlk bağlantı testi
(async () => {
    try {
        await testConnection();
    } catch (error) {
        console.error('Initial connection test failed:', error);
    }
})();

module.exports = {
    executeQuery,
    testConnection
};
