require('dotenv').config();
const mysql = require('mysql2');

// Create a pool for database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',  // Default to 'localhost' if not in .env
  user: process.env.DB_USER || 'root',      // Replace with your MySQL username
  password: process.env.DB_PASSWORD || 'aarushborkar',  // Replace with your MySQL password
  database: process.env.DB_NAME || 'solana_scm', // Replace with your actual database name
});

// Use the pool to execute queries
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
  connection.release(); // Release the connection back to the pool
});

module.exports = pool.promise();