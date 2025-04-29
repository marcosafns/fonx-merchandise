const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'srv1938.hstgr.io',
  user: 'u985226188_admin',
  password: 'C+9HLp7Py',
  database: 'u985226188_fonx'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err.message);
    return;
  }
  console.log('Banco de dados conectado com sucesso!');
});

module.exports = connection;
