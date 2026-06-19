const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'data', 'shop.db'));

db.pragma('journal_mode = WAL');

// ----- Tạo bảng -----
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  image TEXT,
  description TEXT,
  stock INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending', -- pending | approved | rejected
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER,
  product_name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
`);

// ----- Seed dữ liệu mẫu (chỉ chạy nếu bảng trống) -----
const productCount = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
if (productCount === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, price, image, description, stock) VALUES (?, ?, ?, ?, ?)'
  );
  insert.run('Áo thun trơn', 150000, 'https://via.placeholder.com/300x300?text=Ao+Thun', 'Áo thun cotton thoáng mát', 50);
  insert.run('Quần jean nam', 350000, 'https://via.placeholder.com/300x300?text=Quan+Jean', 'Quần jean form slimfit', 30);
  insert.run('Giày sneaker', 600000, 'https://via.placeholder.com/300x300?text=Sneaker', 'Giày thể thao êm chân', 20);
}

// ----- Seed tài khoản admin mặc định -----
const adminCount = db.prepare('SELECT COUNT(*) AS c FROM admins').get().c;
if (adminCount === 0) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('>>> Đã tạo tài khoản admin mặc định: username="admin" password="admin123"');
  console.log('>>> Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu!');
}

module.exports = db;
