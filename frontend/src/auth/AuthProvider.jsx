import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return { id: decoded.id, role: decoded.role };
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data.data;

    localStorage.setItem("token", data.token);
    if (data.user) {
      setUser(data.user);
    } else {
      try {
        const decoded = jwtDecode(data.token);
        setUser({ id: decoded.id, role: decoded.role });
      } catch {
        setUser(null);
      }
    }

    if (data.forcePasswordChange) {
      window.location.href = "/change-password";
    } else {
      window.location.href = "/";
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
