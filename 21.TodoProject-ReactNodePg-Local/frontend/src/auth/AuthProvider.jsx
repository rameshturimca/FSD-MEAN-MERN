import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const FAKE_USER = { username: "admin", password: "admin123", name: "Admin" };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // restore from localStorage
    const raw = localStorage.getItem("todo_app_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async ({ username, password }) => {
    // fake authentication (replace with real API later)
    if (username === FAKE_USER.username && password === FAKE_USER.password) {
      const u = { username, name: FAKE_USER.name };
      setUser(u);
      localStorage.setItem("todo_app_user", JSON.stringify(u));
      return { ok: true };
    }
    return { ok: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("todo_app_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
