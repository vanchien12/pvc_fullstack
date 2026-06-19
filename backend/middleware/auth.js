const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'shop-app-secret-key-change-this-in-production';

function verifyAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Chưa đăng nhập, vui lòng đăng nhập admin.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
    req.admin = decoded;
    next();
  });
}

module.exports = { verifyAdmin, JWT_SECRET };
