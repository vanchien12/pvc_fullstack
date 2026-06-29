// frontend/src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name) return setError("Vui lòng nhập họ và tên");
    if (form.password !== form.confirm) return setError("Mật khẩu xác nhận không khớp");
    if (form.password.length < 6) return setError("Mật khẩu phải có ít nhất 6 ký tự");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setSuccess("✅ Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      // Fix lỗi [object Object]
      if (typeof err.message === "string") {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.detail) {
            setError(Array.isArray(parsed.detail) ? parsed.detail[0]?.msg || "Đăng ký thất bại" : parsed.detail);
          } else {
            setError("Đăng ký thất bại");
          }
        } catch {
          setError(err.message || "Đăng ký thất bại");
        }
      } else {
        setError("Đăng ký thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🛍️ ShopHub</div>
        <h2 style={s.title}>Tạo tài khoản</h2>
        <p style={s.sub}>Tham gia ShopHub ngay hôm nay!</p>

        {error && <div style={s.error}>⚠️ {error}</div>}
        {success && <div style={s.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Họ và tên *</label>
          <input style={s.input} value={form.name} onChange={set("name")} placeholder="Nguyễn Văn A" required />

          <label style={s.label}>Email *</label>
          <input style={s.input} type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" required />

          <label style={s.label}>Mật khẩu *</label>
          <input style={s.input} type="password" value={form.password} onChange={set("password")} placeholder="Tối thiểu 6 ký tự" required />

          <label style={s.label}>Xác nhận mật khẩu *</label>
          <input style={s.input} type="password" value={form.confirm} onChange={set("confirm")} placeholder="Nhập lại mật khẩu" required />

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p style={s.footer}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={s.link}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:"100vh", background:"linear-gradient(135deg,#f0f4ff,#faf5ff)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI', sans-serif" },
  card: { background:"#fff", borderRadius:24, padding:"48px 40px", width:420, boxShadow:"0 16px 48px rgba(99,102,241,0.15)" },
  logo: { fontSize:28, fontWeight:800, textAlign:"center", marginBottom:24 },
  title: { fontSize:28, fontWeight:800, color:"#0f172a", margin:"0 0 6px", textAlign:"center" },
  sub: { color:"#64748b", textAlign:"center", margin:"0 0 28px" },
  error: { background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", padding:"12px 16px", borderRadius:10, marginBottom:16, fontSize:14 },
  success: { background:"#f0fdf4", border:"1px solid #bbf7d0", color:"#16a34a", padding:"12px 16px", borderRadius:10, marginBottom:16, fontSize:14 },
  label: { display:"block", fontSize:14, fontWeight:600, color:"#374151", marginBottom:6 },
  input: { width:"100%", padding:"12px 16px", border:"2px solid #e2e8f0", borderRadius:10, fontSize:15, marginBottom:16, boxSizing:"border-box", outline:"none" },
  btn: { width:"100%", padding:"14px", background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:16, cursor:"pointer" },
  footer: { textAlign:"center", marginTop:20, color:"#64748b", fontSize:14 },
  link: { color:"#6366f1", fontWeight:600, textDecoration:"none" },
};