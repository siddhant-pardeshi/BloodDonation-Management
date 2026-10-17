import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/api';

/**
 * AuthContext — a simple global store for the logged-in user.
 * Any component can read `user` or call `login`, `logout`, etc.
 *
 * Usage:
 *   const { user, loginUser, logoutUser } = useAuth();
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if there's an active session
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data);
    } catch {
      // Not logged in — that's fine
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Called after a successful login/register
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Called on logout
  const logoutUser = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors
    }
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginUser,
    logoutUser,
    checkSession,
    // Convenience flags
    isLoggedIn: !!user,
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook so components don't need useContext directly
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
