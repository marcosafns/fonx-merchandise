const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const db = require('./config/db');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Fala Fonx, tamo online!' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
