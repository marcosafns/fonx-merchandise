const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fonx'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err.message);
    return;
  }
  console.log('Banco de dados conectado com sucesso!');
});

module.exports = connection;
