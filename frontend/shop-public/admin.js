const API = '/api';

function getToken() {
  return localStorage.getItem('adminToken');
}

function setToken(token) {
  localStorage.setItem('adminToken', token);
}

function clearToken() {
  localStorage.removeItem('adminToken');
}

function formatVND(n) {
  return Number(n).toLocaleString('vi-VN') + '₫';
}

function formatDate(s) {
  return new Date(s).toLocaleString('vi-VN');
}

function showDashboard() {
  document.getElementById('login-box').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('logout-link').classList.remove('hidden');
  loadOrders();
}

function showLogin() {
  document.getElementById('login-box').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('logout-link').classList.add('hidden');
}

// ---------- Đăng nhập ----------
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('login-msg');
  msg.innerHTML = '';

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      msg.innerHTML = `<div class="message error">${data.error || 'Đăng nhập thất bại.'}</div>`;
      return;
    }

    setToken(data.token);
    showDashboard();
  } catch (err) {
    msg.innerHTML = `<div class="message error">Không thể kết nối tới server.</div>`;
  }
});

document.getElementById('logout-link').addEventListener('click', (e) => {
  e.preventDefault();
  clearToken();
  showLogin();
});

// ---------- Tải danh sách đơn hàng ----------
async function loadOrders() {
  const msg = document.getElementById('orders-msg');
  msg.innerHTML = '';

  try {
    const res = await fetch(`${API}/orders`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.status === 401 || res.status === 403) {
      clearToken();
      showLogin();
      msg.innerHTML = `<div class="message error">Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.</div>`;
      return;
    }

    const orders = await res.json();
    renderOrders(orders);
  } catch (err) {
    msg.innerHTML = `<div class="message error">Không thể kết nối tới server.</div>`;
  }
}

function renderOrders(orders) {
  const tbody = document.getElementById('orders-table-body');
  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888;">Chưa có đơn hàng nào.</td></tr>`;
    return;
  }

  orders.forEach((order) => {
    const itemsText = order.items
      .map((i) => `${i.product_name} x${i.quantity}`)
      .join('<br/>');

    const statusLabel = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Đã từ chối',
    }[order.status];

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.customer_name}<br/><span style="color:#888;font-size:12px;">${formatDate(order.created_at)}</span></td>
      <td>${order.phone || '-'}</td>
      <td class="order-items-list">${itemsText}</td>
      <td>${formatVND(order.total)}</td>
      <td><span class="badge ${order.status}">${statusLabel}</span></td>
      <td>
        ${
          order.status === 'pending'
            ? `<button class="btn success approve-btn" data-id="${order.id}" style="margin-bottom:4px;">Duyệt</button>
               <button class="btn danger reject-btn" data-id="${order.id}">Từ chối</button>`
            : `<span style="color:#aaa; font-size:12px;">Đã xử lý</span>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.approve-btn').forEach((btn) =>
    btn.addEventListener('click', () => updateOrderStatus(btn.dataset.id, 'approved'))
  );
  document.querySelectorAll('.reject-btn').forEach((btn) =>
    btn.addEventListener('click', () => updateOrderStatus(btn.dataset.id, 'rejected'))
  );
}

async function updateOrderStatus(orderId, status) {
  const msg = document.getElementById('orders-msg');
  msg.innerHTML = '';

  try {
    const res = await fetch(`${API}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();

    if (!res.ok) {
      msg.innerHTML = `<div class="message error">${data.error || 'Có lỗi xảy ra.'}</div>`;
      return;
    }

    msg.innerHTML = `<div class="message success">Đã cập nhật đơn hàng #${orderId}.</div>`;
    loadOrders();
  } catch (err) {
    msg.innerHTML = `<div class="message error">Không thể kết nối tới server.</div>`;
  }
}

// ---------- Khởi động ----------
if (getToken()) {
  showDashboard();
} else {
  showLogin();
}
