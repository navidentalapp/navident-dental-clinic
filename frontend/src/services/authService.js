// frontend/src/services/authService.js
import axios from 'axios';

// Keep REACT_APP_API_URL in Render static site env vars pointing to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const authService = {
  login: (credentials) => {
    // ✅ Now matches backend AuthController @PostMapping("/login") under /api/auth
    return axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
  },

  refresh: (token) => {
    return axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getCurrentUser: (token) => {
    return axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  logout: () => {
    return axios.post(`${API_BASE_URL}/api/auth/logout`);
  }
};
