const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { verifyAdmin } = require('../middleware/auth');

// POST /api/orders - khách hàng đặt hàng / thanh toán (public)
// body: { customerName, phone, address, items: [{ productId, quantity }] }
router.post('/', (req, res) => {
  const { customerName, phone, address, items } = req.body;

  if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Vui lòng nhập tên khách hàng và giỏ hàng không được trống.' });
  }

  // Lấy thông tin sản phẩm thực tế từ DB để tính tiền chính xác (không tin giá từ client)
  const getProduct = db.prepare('SELECT * FROM products WHERE id = ?');
  let total = 0;
  const orderItemsData = [];

  for (const item of items) {
    const product = getProduct.get(item.productId);
    if (!product) {
      return res.status(400).json({ error: `Sản phẩm id=${item.productId} không tồn tại.` });
    }
    if (item.quantity <= 0) {
      return res.status(400).json({ error: 'Số lượng sản phẩm phải lớn hơn 0.' });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Sản phẩm "${product.name}" không đủ hàng tồn kho.` });
    }
    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    orderItemsData.push({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const insertOrder = db.prepare(
    'INSERT INTO orders (customer_name, phone, address, total, status) VALUES (?, ?, ?, ?, ?)'
  );
  const orderResult = insertOrder.run(customerName, phone || '', address || '', total, 'pending');
  const orderId = orderResult.lastInsertRowid;

  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)'
  );
  for (const it of orderItemsData) {
    insertItem.run(orderId, it.product_id, it.product_name, it.price, it.quantity);
  }

  const newOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const newOrderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  res.status(201).json({ ...newOrder, items: newOrderItems });
});

// GET /api/orders - admin xem tất cả đơn hàng (chỉ admin)
router.get('/', verifyAdmin, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  const result = orders.map((order) => ({
    ...order,
    items: getItems.all(order.id),
  }));
  res.json(result);
});

// GET /api/orders/:id - chi tiết 1 đơn hàng (chỉ admin)
router.get('/:id', verifyAdmin, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  res.json({ ...order, items });
});

// PUT /api/orders/:id/status - admin duyệt / từ chối đơn hàng (chỉ admin)
// body: { status: 'approved' | 'rejected' }
router.put('/:id/status', verifyAdmin, (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ. Dùng: pending, approved, rejected.' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });

  // Nếu duyệt đơn -> trừ kho
  if (status === 'approved' && order.status !== 'approved') {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    for (const item of items) {
      if (item.product_id) {
        updateStock.run(item.quantity, item.product_id);
      }
    }
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json(updated);
});

module.exports = router;
