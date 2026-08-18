"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }, []);

  const refreshUser = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,

      setUser,
      setLoading,
      setIsAuthenticated,

      login,
      logout,
      refreshUser,
    }),
    [user, isAuthenticated, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider.");
  }

  return context;
};
