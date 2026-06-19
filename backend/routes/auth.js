const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login - đăng nhập admin
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin) {
    return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu.' });
  }

  const isValid = bcrypt.compareSync(password, admin.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu.' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, username: admin.username });
});

// POST /api/auth/change-password - đổi mật khẩu admin (cần đăng nhập)
const { verifyAdmin } = require('../middleware/auth');
router.post('/change-password', verifyAdmin, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Vui lòng nhập đủ mật khẩu cũ và mới.' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id);
  const isValid = bcrypt.compareSync(oldPassword, admin.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Mật khẩu cũ không đúng.' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(newHash, req.admin.id);
  res.json({ message: 'Đổi mật khẩu thành công.' });
});

module.exports = router;
