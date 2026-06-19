const API = '/api';

let products = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]'); // [{productId, quantity}]

// ---------- Helpers ----------
function formatVND(n) {
  return Number(n).toLocaleString('vi-VN') + '₫';
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function getAdminToken() {
  return localStorage.getItem('adminToken');
}

// ---------- Load sản phẩm ----------
async function loadProducts() {
  const res = await fetch(`${API}/products`);
  products = await res.json();
  renderProducts();
}

function renderProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/300x300?text=No+Image'}" alt="${p.name}" />
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="price">${formatVND(p.price)}</div>
        <div class="stock">${p.stock > 0 ? `Còn ${p.stock} sản phẩm` : 'Hết hàng'}</div>
        <button data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
          ${p.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => addToCart(p.id));
    list.appendChild(card);
  });
}

// ---------- Giỏ hàng ----------
function addToCart(productId) {
  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  saveCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((i) => i.productId !== productId);
  saveCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total-value');

  container.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    count += item.quantity;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${product.image || 'https://via.placeholder.com/60'}" />
      <div class="details">
        <div class="name">${product.name}</div>
        <div class="price">${formatVND(product.price)}</div>
        <div class="qty-controls">
          <button data-action="dec">−</button>
          <span>${item.quantity}</span>
          <button data-action="inc">+</button>
          <button class="remove-btn" data-action="remove">Xóa</button>
        </div>
      </div>
    `;
    row.querySelector('[data-action="dec"]').addEventListener('click', () => changeQuantity(product.id, -1));
    row.querySelector('[data-action="inc"]').addEventListener('click', () => changeQuantity(product.id, 1));
    row.querySelector('[data-action="remove"]').addEventListener('click', () => removeFromCart(product.id));
    container.appendChild(row);
  });

  if (cart.length === 0) {
    container.innerHTML = '<p style="color:#888; text-align:center; margin-top:20px;">Giỏ hàng trống</p>';
  }

  countEl.textContent = count;
  totalEl.textContent = formatVND(total);
}

// ---------- Mở / đóng giỏ hàng ----------
function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

document.getElementById('cart-toggle').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);

// ---------- Checkout ----------
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('checkout-msg');
  msg.innerHTML = '';

  if (cart.length === 0) {
    msg.innerHTML = `<div class="message error">Giỏ hàng đang trống.</div>`;
    return;
  }

  const payload = {
    customerName: document.getElementById('c-name').value.trim(),
    phone: document.getElementById('c-phone').value.trim(),
    address: document.getElementById('c-address').value.trim(),
    items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
  };

  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      msg.innerHTML = `<div class="message error">${data.error || 'Có lỗi xảy ra.'}</div>`;
      return;
    }

    msg.innerHTML = `<div class="message success">Đặt hàng thành công! Đơn hàng #${data.id} đang chờ admin duyệt.</div>`;
    cart = [];
    saveCart();
    document.getElementById('checkout-form').reset();
    await loadProducts(); // cập nhật lại tồn kho hiển thị (nếu có)
  } catch (err) {
    msg.innerHTML = `<div class="message error">Không thể kết nối tới server.</div>`;
  }
});

// ---------- Thêm sản phẩm (cần admin token) ----------
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('add-product-msg');
  msg.innerHTML = '';

  const token = getAdminToken();
  if (!token) {
    msg.innerHTML = `<div class="message error">Bạn cần đăng nhập admin trước. <a href="/admin">Đăng nhập</a></div>`;
    return;
  }

  const payload = {
    name: document.getElementById('p-name').value.trim(),
    price: Number(document.getElementById('p-price').value),
    stock: Number(document.getElementById('p-stock').value) || 0,
    image: document.getElementById('p-image').value.trim(),
    description: document.getElementById('p-description').value.trim(),
  };

  try {
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      msg.innerHTML = `<div class="message error">${data.error || 'Có lỗi xảy ra.'}</div>`;
      return;
    }

    msg.innerHTML = `<div class="message success">Đã thêm sản phẩm "${data.name}".</div>`;
    document.getElementById('add-product-form').reset();
    await loadProducts();
  } catch (err) {
    msg.innerHTML = `<div class="message error">Không thể kết nối tới server.</div>`;
  }
});

// ---------- Khởi động ----------
loadProducts().then(renderCart);
