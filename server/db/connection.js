const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your database username
  password: 'aarushborkar', // replace with your database password
  database: 'solana_scm' // replace with your database name
});

// Enable promise support for queries
const promiseDb = db.promise();

module.exports = promiseDb;