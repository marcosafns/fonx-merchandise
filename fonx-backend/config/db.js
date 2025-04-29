const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '193.203.175.251',
  user: 'u985226188_admin',
  password: 'C+9HLp7Py',
  database: 'u985226188_fonx',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;