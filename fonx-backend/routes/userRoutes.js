const express = require('express');
const router = express.Router();

const db = require('../config/db');
const bcrypt = require('bcryptjs'); // pra criptografar a senha

// Rota de registro
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    // Verifica se já existe email cadastrado
    const [existingUser] = await new Promise((resolve, reject) => {
      db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere no banco
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

  
const jwt = require('jsonwebtoken');

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
domain: '.fonx.com.br', // coloca true quando for em produção HTTPS
          maxAge: 3600000, // 1 hora
          path: '/',
      });

      res.json({ message: 'Login realizado com sucesso!' });
  });
});
  
  const verifyToken = require('../middleware/verifyToken');

  router.get('/profile', verifyToken, (req, res) => {
    const userId = req.user.id;
  
    const sql = 'SELECT name, email, phone FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Erro ao buscar perfil:', err);
        return res.status(500).json({ message: 'Erro no servidor ao buscar perfil.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      const user = results[0];
      res.json({ user });
    });
  });
  
  const admin = require('firebase-admin');
  
  router.post('/google-login', async (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(400).json({ message: 'Token não enviado.' });
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { email, name } = decodedToken;
  
      const sqlCheck = 'SELECT * FROM users WHERE email = ?';
      db.query(sqlCheck, [email], (err, results) => {
        if (err) {
          console.error('Erro ao buscar usuário:', err);
          return res.status(500).json({ message: 'Erro no servidor.' });
        }
  
        if (results.length > 0) {
          const user = results[0];
          const jwtToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, 'seuSegredoUltraSecreto', { expiresIn: '1h' });
          
          res.cookie('fonx_token', jwtToken, {
            httpOnly: true,
            secure: true,
domain: '.fonx.com.br',
            maxAge: 3600000,
            path: '/',
          });
  
          return res.json({ message: 'Login via Google realizado com sucesso!' });
        } else {
          const sqlInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
          db.query(sqlInsert, [name, email, ''], (err, result) => {
            if (err) {
              console.error('Erro ao criar usuário:', err);
              return res.status(500).json({ message: 'Erro no servidor.' });
            }
  
            const newUserId = result.insertId;
            const jwtToken = jwt.sign({ id: newUserId, email, name }, 'seuSegredoUltraSecreto', { expiresIn: '1h' });
  
            res.cookie('fonx_token', jwtToken, {
              httpOnly: true,
              secure: true,
domain: '.fonx.com.br',
              maxAge: 3600000,
              path: '/',
            });
  
            return res.json({ message: 'Usuário criado e logado via Google!' });
          });
        }
      });
    } catch (error) {
      console.error('Erro ao verificar token Google:', error);
      res.status(401).json({ message: 'Token inválido.' });
    }
  });
  
  router.post('/logout', (req, res) => {
    res.clearCookie('fonx_token', {
      httpOnly: true,
      secure: true,
domain: '.fonx.com.br', // coloca true quando for HTTPS
      path: '/',
    });
    res.json({ message: 'Logout realizado com sucesso' });
  });
  
// Atualizar perfil
router.post('/profile/update', verifyToken, (req, res) => {
  const userId = req.user.id;
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nome e e-mail são obrigatórios.' });
  }

  const sql = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.query(sql, [name, email, phone, userId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar perfil:', err);
      return res.status(500).json({ message: 'Erro no servidor ao atualizar perfil.' });
    }

    return res.json({ message: 'Perfil atualizado com sucesso.' });
  });
});

module.exports = router;
