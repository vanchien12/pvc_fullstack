import { useAuth } from "../context/AuthContext";
import "./AdminPage.css";

const AdminPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar__logo">ShopHub Admin</h2>
        <nav className="admin-sidebar__nav">
          <a className="admin-sidebar__link admin-sidebar__link--active" href="#dashboard">
            📊 Tổng quan
          </a>
          <a className="admin-sidebar__link" href="#products">
            📦 Sản phẩm
          </a>
          <a className="admin-sidebar__link" href="#orders">
            🧾 Đơn hàng
          </a>
          <a className="admin-sidebar__link" href="#users">
            👥 Người dùng
          </a>
        </nav>
        <button className="admin-sidebar__logout" onClick={logout}>
          Đăng xuất
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Tổng quan</h1>
          <span className="admin-header__user">
            Xin chào, <strong>{user?.name}</strong>
          </span>
        </header>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">Sản phẩm</span>
            <span className="admin-stat-card__value">8</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">Đơn hàng</span>
            <span className="admin-stat-card__value">0</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">Người dùng</span>
            <span className="admin-stat-card__value">1</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">Doanh thu</span>
            <span className="admin-stat-card__value">0đ</span>
          </div>
        </section>

        <p className="admin-placeholder">
          Khu vực quản lý sản phẩm / đơn hàng / người dùng sẽ được phát triển ở các bước tiếp theo.
        </p>
      </main>
    </div>
  );
};

export default AdminPage;
