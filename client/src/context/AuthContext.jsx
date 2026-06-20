import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
        } catch (err) {
          console.error("Token verification failed", err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isDoctor = user?.role === 'DOCTOR';
  const isPatient = user?.role === 'PATIENT';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, isAdmin, isDoctor, isPatient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
