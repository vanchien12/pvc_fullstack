import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const BASE_URL = "http://localhost:8000/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shophub_user")); } catch { return null; }
  });

  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Đăng nhập thất bại");
    }
    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("shophub_user", JSON.stringify(data.user));
    localStorage.setItem("shophub_token", data.access_token);
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Đăng ký thất bại");
    }
    return res.json();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shophub_user");
    localStorage.removeItem("shophub_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === "admin", isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }