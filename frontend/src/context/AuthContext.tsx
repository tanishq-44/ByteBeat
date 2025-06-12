import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AuthService, { IUser, LoginCredentials, RegisterData } from '../services/authService';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  clearError: () => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  clearError: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = () => {
      const user = AuthService.getCurrentUser();
      setUser(user);
      setIsAuthenticated(AuthService.isAuthenticated());
      setIsAdmin(AuthService.isAdmin());
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await AuthService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.role === 'admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await AuthService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.role === 'admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 