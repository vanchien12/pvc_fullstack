import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = ({ siteName }) => {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <span className="header__greeting">Chào mừng đến với</span>
        <h1 className="header__title">{siteName}</h1>
      </Link>

      <nav className="header__nav">
        <Link to="/">Trang chủ</Link>
        <a href="#products">Sản phẩm</a>
        <a href="#about">Giới thiệu</a>
        {isAdmin && <Link to="/admin">Quản trị</Link>}
      </nav>

      <div className="header__actions">
        <Link to="/cart" className="header__cart">
          🛒 Giỏ hàng <span className="header__cart-count">{cartCount}</span>
        </Link>

        {user ? (
          <div className="header__user">
            <span>👋 {user.name}</span>
            <button className="header__logout-btn" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link to="/login" className="header__login-btn">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
