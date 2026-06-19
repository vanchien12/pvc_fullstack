import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../api/client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // React State: thông tin user hiện tại (null = chưa đăng nhập)
  const [user, setUser] = useState(null);

  // React State: đang kiểm tra phiên đăng nhập cũ hay không (tránh nháy UI)
  const [loading, setLoading] = useState(true);

  // useEffect: khi app khởi động, kiểm tra token đã lưu trong localStorage
  // để tự động đăng nhập lại nếu còn hợp lệ
  useEffect(() => {
    const token = localStorage.getItem("shophub_token");

    if (!token) {
      setLoading(false);
      return;
    }

    apiClient
      .get("/auth/me")
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("shophub_token");
      })
      .finally(() => setLoading(false));
  }, []);

  // Đăng ký tài khoản mới
  const register = async ({ name, email, password }) => {
    await apiClient.post("/auth/register", { name, email, password });
    // Sau khi đăng ký thành công, tự động đăng nhập luôn
    return login({ email, password });
  };

  // Đăng nhập, lưu token, lấy thông tin user
  const login = async ({ email, password }) => {
    const data = await apiClient.post("/auth/login", { email, password });
    localStorage.setItem("shophub_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  // Đăng xuất: xoá token và state user
  const logout = () => {
    localStorage.removeItem("shophub_token");
    setUser(null);
  };

  // Kiểm tra nhanh user có phải admin không
  const isAdmin = user?.role === "admin";

  const value = { user, loading, isAdmin, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
