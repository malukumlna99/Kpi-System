import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  // Initialize auth state from localStorage
  initialize: async () => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, loading: false });
        
        // Verify token is still valid
        const response = await authAPI.getCurrentUser();
        set({ user: response.data.data, loading: false });
      } catch (error) {
        // Token invalid, clear storage
        localStorage.clear();
        set({ user: null, token: null, isAuthenticated: false, loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, refresh_token, user } = response.data.data;

      // Store in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      set({
        user,
        token: access_token,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal',
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage
      localStorage.clear();
      
      // Reset state
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  // Update user
  updateUser: (userData) => {
    set({ user: userData });
    localStorage.setItem('user', JSON.stringify(userData));
  },

  // Check if user is manager
  isManager: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'manager';
  },

  // Check if user is karyawan
  isKaryawan: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'karyawan';
  },
}));

export default useAuthStore;
