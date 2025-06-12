import api from './api';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: IUser;
}

const AuthService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register user
  register: async (userData: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: (): IUser | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'admin';
  },
};

export default AuthService; 