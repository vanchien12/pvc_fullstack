// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shophub_user")); } catch { return null; }
  });

  const login = async (username, password) => {
    const data = await api.post("/auth/login", { username, password });
    setUser(data.user);
    localStorage.setItem("shophub_user", JSON.stringify(data.user));
    localStorage.setItem("shophub_token", data.token);
    return data.user;
  };

  const register = async (username, password, email) => {
    const data = await api.post("/auth/register", { username, password, email });
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shophub_user");
    localStorage.removeItem("shophub_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }