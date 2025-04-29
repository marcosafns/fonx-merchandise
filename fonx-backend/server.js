const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db');
// const admin = require('firebase-admin');
const cookieParser = require('cookie-parser');
// const serviceAccount = require('./Key/firebasePass.json');
const port = 5000;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

app.use(cors({
  origin: 'https://fonx.com.br',
  credentials: true,
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.options('*', cors());

app.use(express.json());

app.use(cookieParser());

// Rotas
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Fala Fonx, tamo online!' });
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});