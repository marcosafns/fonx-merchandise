const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/verifyToken');

// Adicionar item ao carrinho
router.post('/add', verifyToken, (req, res) => {
  const { product_name, product_img, price, quantity, size } = req.body;
  const userId = req.user.id;

  if (!product_name || !product_img || !price || !quantity || !size) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  const sql = 'INSERT INTO cart_items (user_id, product_name, product_img, price, quantity, size) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [userId, product_name, product_img, price, quantity, size], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar produto no carrinho:', err);
      return res.status(500).json({ message: 'Erro ao adicionar no carrinho.' });
    }
    res.status(201).json({ message: 'Produto adicionado ao carrinho!' });
  });
});

// Ver carrinho do usuário
router.get('/', verifyToken, (req, res) => {
  const userId = req.user.id;

  const sql = 'SELECT * FROM cart_items WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar carrinho:', err);
      return res.status(500).json({ message: 'Erro ao buscar carrinho.' });
    }
    res.json(results);
  });
});

// Remover item do carrinho
router.delete('/remove/:id', verifyToken, (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  const sql = 'DELETE FROM cart_items WHERE id = ? AND user_id = ?';
  db.query(sql, [itemId, userId], (err, result) => {
    if (err) {
      console.error('Erro ao remover item do carrinho:', err);
      return res.status(500).json({ message: 'Erro ao remover item.' });
    }
    res.json({ message: 'Item removido do carrinho!' });
  });
});

// Atualizar quantidade de um item no carrinho
router.put('/update/:id', verifyToken, (req, res) => {
    const itemId = req.params.id;
    const userId = req.user.id;
    const { quantity } = req.body;
  
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantidade inválida.' });
    }
  
    const sql = 'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?';
    db.query(sql, [quantity, itemId, userId], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar quantidade:', err);
        return res.status(500).json({ message: 'Erro ao atualizar item.' });
      }
      res.json({ message: 'Quantidade atualizada com sucesso!' });
    });
  });
  

module.exports = router;
