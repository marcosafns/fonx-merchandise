const express = require('express');
const router = express.Router();
const db = require('../config/db'); // seu banco

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      return res.status(500).json({ message: 'Erro no servidor.' });
    }
    res.json(results);
  });
});

// Buscar produto pelo ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
  
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Erro ao buscar produto:', err);
        return res.status(500).json({ message: 'Erro no servidor.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
      }
  
      res.json(results[0]);
    });
  });
  

module.exports = router;
