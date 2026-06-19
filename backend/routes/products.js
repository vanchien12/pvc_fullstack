const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { verifyAdmin } = require('../middleware/auth');

// GET /api/products - danh sách sản phẩm (public)
router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(products);
});

// GET /api/products/:id - chi tiết 1 sản phẩm (public)
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
  res.json(product);
});

// POST /api/products - thêm sản phẩm mới (chỉ admin)
router.post('/', verifyAdmin, (req, res) => {
  const { name, price, image, description, stock } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Vui lòng nhập tên và giá sản phẩm.' });
  }

  const result = db
    .prepare('INSERT INTO products (name, price, image, description, stock) VALUES (?, ?, ?, ?, ?)')
    .run(name, price, image || '', description || '', stock || 0);

  const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - sửa sản phẩm (chỉ admin)
router.put('/:id', verifyAdmin, (req, res) => {
  const { name, price, image, description, stock } = req.body;
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });

  db.prepare(
    'UPDATE products SET name = ?, price = ?, image = ?, description = ?, stock = ? WHERE id = ?'
  ).run(
    name ?? existing.name,
    price ?? existing.price,
    image ?? existing.image,
    description ?? existing.description,
    stock ?? existing.stock,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/products/:id - xóa sản phẩm (chỉ admin)
router.delete('/:id', verifyAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });

  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Đã xóa sản phẩm.' });
});

module.exports = router;
