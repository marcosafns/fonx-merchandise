const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.cookies.fonx_token;

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, 'seuSegredoUltraSecreto');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}

module.exports = verifyToken;
