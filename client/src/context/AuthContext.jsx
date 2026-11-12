import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const token = api.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        api.setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await api.login({ email, password });
      setUser(data.user);
      return data;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (email, password, fullName) => {
    setAuthError(null);
    try {
      const data = await api.register({ email, password, fullName });
      setUser(data.user);
      return data;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

