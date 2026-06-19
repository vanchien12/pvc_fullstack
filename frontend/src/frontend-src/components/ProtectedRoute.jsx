import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Component bọc quanh route cần bảo vệ
// adminOnly = true: chỉ cho phép user có role "admin" truy cập
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  // Đang kiểm tra phiên đăng nhập -> hiển thị loading, tránh redirect nhầm
  if (loading) {
    return <p className="protected-route__loading">Đang kiểm tra đăng nhập...</p>;
  }

  // Chưa đăng nhập -> chuyển về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Cần quyền admin nhưng user không phải admin -> chuyển về trang chủ
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
