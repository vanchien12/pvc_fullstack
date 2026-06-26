import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage          from "./pages/HomePage";
import ProductsPage      from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage          from "./pages/CartPage";
import LoginPage         from "./pages/LoginPage";
import RegisterPage      from "./pages/RegisterPage";
import AdminPage         from "./pages/AdminPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* ===== Lab 05 — React Router ===== */}

            {/* Route 1: Trang chủ */}
            <Route path="/" element={<HomePage />} />

            {/* Route 2: Danh sách sản phẩm */}
            <Route path="/products" element={<ProductsPage />} />

            {/* Route 3: Chi tiết sản phẩm — Route Parameters (:id) */}
            <Route path="/products/:id" element={<ProductDetailPage />} />

            {/* Route 4: Giỏ hàng */}
            <Route path="/cart" element={<CartPage />} />

            {/* Route 5: Đăng nhập — dùng <Navigate> để redirect */}
            <Route path="/login" element={<LoginPage />} />

            {/* Đăng ký */}
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin — Protected Route (chỉ admin mới vào được) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Mọi route không khớp → về trang chủ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
