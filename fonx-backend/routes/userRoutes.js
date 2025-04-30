const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ message: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      'seuSegredoUltraSecreto',
      { expiresIn: '1h' }
    );

    res.cookie('fonx_token', token, {
      httpOnly: true,
      secure: true,
      domain: '.fonx.com.br',
      path: '/',
      maxAge: 3600000,
    });

    res.json({ message: 'Login realizado com sucesso!' });
  });
});

// PROFILE
router.get('/profile', verifyToken, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  
  const sql = 'SELECT id, email, name, phone FROM users WHERE id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar perfil:', err);
      return res.status(500).json({ message: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json(results[0]);
  });
});

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Erro ao registrar usuário:', err);
      return res.status(500).json({ message: 'Erro no servidor.' });
    }

    res.json({ message: 'Cadastro realizado com sucesso!' });
  });
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('fonx_token', {
    httpOnly: true,
    secure: true,
    domain: '.fonx.com.br',
    path: '/',
  });
  res.json({ message: 'Logout realizado com sucesso!' });
});

module.exports = router;
