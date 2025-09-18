import React, { createContext, useState, useEffect } from "react";
import { getUser, loginUser, logoutUser, registerUser } from "../services/api";
import { getToken, setToken, clearToken } from "../utils/token";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const res = await getUser();
          setUser(res.user);
        } catch (err) {
          console.error("Auth error:", err);
          clearToken();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // AuthContext.js
const login = async (email, password) => {
  const res = await loginUser(email, password);
  setToken(res.token); // utils handles localStorage
  setUser(res.user);
};


  const register = async (email, password, name) => {
    const res = await registerUser(email, password, name);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    logoutUser();
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
