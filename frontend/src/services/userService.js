import api from './api';

export const userService = {
  getAll: (params = {}) => {
    return api.get('/users', { params });
  },
  
  getById: (id) => {
    return api.get(`/users/${id}`);
  },
  
  create: (userData) => {
    return api.post('/users', userData);
  },
  
  update: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },
  
  delete: (id) => {
    return api.delete(`/users/${id}`);
  },
  
  search: (query) => {
    return api.get('/users/search', { params: { query } });
  },
  
  changePassword: (id, passwordData) => {
    return api.put(`/users/${id}/change-password`, passwordData);
  },

  toggleActiveStatus: (id) => {
    return api.put(`/users/${id}/toggle-active`);
  }
};
