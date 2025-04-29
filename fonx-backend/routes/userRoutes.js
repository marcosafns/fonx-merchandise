const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const verifyToken = require('../middleware/verifyToken');

// Função para buscar usuário por email
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Função para gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    'seuSegredoUltraSecreto',
    { expiresIn: '1h' }
  );
};

// Função para configurar cookie
const setCookie = (res, token) => {
  res.cookie('fonx_token', token, {
    httpOnly: true,
    secure: false, // coloca true em produção
    maxAge: 3600000, // 1 hora
    path: '/',
  });
};

// Rota de registro
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    const [existingUser] = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
        [name, email, phone, hashedPassword],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    return res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  try {
    const results = await findUserByEmail(email);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const token = generateToken(user);
    setCookie(res, token);

    res.json({ message: 'Login realizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// Outras rotas seguem o mesmo padrão...
