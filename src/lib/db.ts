import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DEV_DB_HOST || 'localhost',
  user: process.env.DEV_DB_USERNAME || 'root',
  password: process.env.DEV_DB_PASSWORD || '',
  database: process.env.DEV_DB_NAME || 'letsmeet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; 