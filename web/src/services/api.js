import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data.data;

          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token expired, logout
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || 'Terjadi kesalahan';
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
  register: (userData) => api.post('/auth/register', userData),
};

// ==================== DEVISI API ====================
export const devisiAPI = {
  getAll: (params) => api.get('/devisi', { params }),
  getById: (id) => api.get(`/devisi/${id}`),
  create: (data) => api.post('/devisi', data),
  update: (id, data) => api.put(`/devisi/${id}`, data),
  delete: (id) => api.delete(`/devisi/${id}`),
};

// ==================== USER API ====================
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  activate: (id) => api.patch(`/users/${id}/activate`),
};

// ==================== KPI API ====================
export const kpiAPI = {
  getAll: (params) => api.get('/kpi', { params }),
  getById: (id) => api.get(`/kpi/${id}`),
  getMyKpis: () => api.get('/kpi/my-kpis'),
  create: (data) => api.post('/kpi', data),
  update: (id, data) => api.put(`/kpi/${id}`, data),
  delete: (id) => api.delete(`/kpi/${id}`),
};

// ==================== ASSESSMENT API ====================
export const assessmentAPI = {
  submit: (data) => api.post('/assessments/submit', data),
  saveDraft: (data) => api.post('/assessments/draft', data),
  getMyHistory: (params) => api.get('/assessments/my-history', { params }),
  getById: (id) => api.get(`/assessments/${id}`),
  review: (id, data) => api.post(`/assessments/${id}/review`, data),
};

// ==================== REPORTS API ====================
export const reportsAPI = {
  getDashboard: (params) => api.get('/reports/dashboard', { params }),
  getEmployees: (params) => api.get('/reports/employees', { params }),
  getEmployeeDetail: (id, params) => api.get(`/reports/employees/${id}`, { params }),
  getKpiStatistics: (id, params) => api.get(`/reports/kpi/${id}/statistics`, { params }),
};

export default api;
