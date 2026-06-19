const express = require('express');
const cors = require('cors');
const path = require('path');

require('./db/database'); // khởi tạo DB + seed dữ liệu

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());
app.use(express.json());

// Serve file tĩnh (HTML/CSS/JS) trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Trang admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log(`   Trang chủ:  http://localhost:${PORT}/`);
  console.log(`   Trang admin: http://localhost:${PORT}/admin`);
});
