// frontend/src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await login(username, password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch {
      setError("Sai tên đăng nhập hoặc mật khẩu");
    } finally { setLoading(false); }
  };

  return (
    <div style={formStyles.page}>
      <div style={formStyles.card}>
        <div style={formStyles.logo}>🛍️ ShopHub</div>
        <h2 style={formStyles.title}>Đăng nhập</h2>
        <p style={formStyles.sub}>Chào mừng bạn trở lại!</p>
        {error && <div style={formStyles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={formStyles.label}>Tên đăng nhập</label>
          <input style={formStyles.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="Nhập tên đăng nhập" required />
          <label style={formStyles.label}>Mật khẩu</label>
          <input style={formStyles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu" required />
          <button type="submit" style={formStyles.btn} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <div style={formStyles.hint}>
          <span style={{ color:"#64748b", fontSize:13 }}>💡 Admin: admin / admin123 | User: user1 / user123</span>
        </div>
        <p style={formStyles.footer}>Chưa có tài khoản? <Link to="/register" style={formStyles.link}>Đăng ký ngay</Link></p>
      </div>
    </div>
  );
}

const formStyles = {
  page: { minHeight:"100vh", background:"linear-gradient(135deg,#f0f4ff,#faf5ff)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI', sans-serif" },
  card: { background:"#fff", borderRadius:24, padding:"48px 40px", width:400, boxShadow:"0 16px 48px rgba(99,102,241,0.15)" },
  logo: { fontSize:28, fontWeight:800, textAlign:"center", marginBottom:24 },
  title: { fontSize:28, fontWeight:800, color:"#0f172a", margin:"0 0 6px", textAlign:"center" },
  sub: { color:"#64748b", textAlign:"center", margin:"0 0 28px" },
  error: { background:"#fef2f2", border:"1px solid #fecaca", color:"#ef4444", padding:"12px 16px", borderRadius:10, marginBottom:20, fontSize:14 },
  label: { display:"block", fontSize:14, fontWeight:600, color:"#374151", marginBottom:6 },
  input: { width:"100%", padding:"12px 16px", border:"2px solid #e2e8f0", borderRadius:10, fontSize:15, marginBottom:18, boxSizing:"border-box", outline:"none" },
  btn: { width:"100%", padding:"14px", background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:16, cursor:"pointer", marginTop:4 },
  hint: { margin:"16px 0 0", padding:"12px", background:"#f8fafc", borderRadius:10, textAlign:"center" },
  footer: { textAlign:"center", marginTop:20, color:"#64748b", fontSize:14 },
  link: { color:"#6366f1", fontWeight:600 },
};