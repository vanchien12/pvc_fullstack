import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

const LoginPage = () => {
  // React State: dữ liệu form, dùng 1 object thay vì nhiều state riêng lẻ
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Arrow function: cập nhật formData khi người dùng gõ, dùng destructuring từ event
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await login(formData);
      // Nếu trước đó bị redirect từ trang cần đăng nhập, quay lại đúng trang đó
      const redirectTo = location.state?.from || (user.role === "admin" ? "/admin" : "/");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-card__title">Đăng nhập</h1>
        <p className="auth-card__subtitle">Chào mừng quay lại ShopHub</p>

        {error && <p className="auth-card__error">{error}</p>}

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ban@email.com"
            required
          />
        </label>

        <label className="auth-field">
          <span>Mật khẩu</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </label>

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="auth-card__footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
