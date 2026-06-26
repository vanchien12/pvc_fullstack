// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛍️ ShopHub</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Trang chủ</Link>
        <Link to="/products" style={styles.link}>Sản phẩm</Link>
        {isAdmin && <Link to="/admin" style={{ ...styles.link, color: "#f59e0b" }}>Admin</Link>}
      </div>
      <div style={styles.actions}>
        <Link to="/cart" style={styles.cartBtn}>
          🛒 <span style={styles.badge}>{count}</span>
        </Link>
        {user ? (
          <div style={styles.userMenu}>
            <span style={styles.username}>👤 {user.username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
          </div>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Đăng nhập</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:64, background:"#1e293b", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 8px rgba(0,0,0,0.3)" },
  logo: { color:"#fff", fontWeight:700, fontSize:22, textDecoration:"none", letterSpacing:"-0.5px" },
  links: { display:"flex", gap:28 },
  link: { color:"#cbd5e1", textDecoration:"none", fontWeight:500, fontSize:15, transition:"color 0.2s" },
  actions: { display:"flex", alignItems:"center", gap:16 },
  cartBtn: { position:"relative", color:"#fff", textDecoration:"none", fontSize:22 },
  badge: { position:"absolute", top:-8, right:-8, background:"#ef4444", color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 },
  userMenu: { display:"flex", alignItems:"center", gap:10 },
  username: { color:"#94a3b8", fontSize:14 },
  logoutBtn: { background:"transparent", border:"1px solid #475569", color:"#cbd5e1", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontSize:13 },
  loginBtn: { background:"#6366f1", color:"#fff", padding:"8px 18px", borderRadius:8, textDecoration:"none", fontWeight:600, fontSize:14 },
};