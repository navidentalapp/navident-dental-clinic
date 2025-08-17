import api from './api';

export const insuranceService = {
  getAll: (params = {}) => api.get('/insurance', { params }),
  getById: (id) => api.get(`/insurance/${id}`),
  create: (data) => api.post('/insurance', data),
  update: (id, data) => api.put(`/insurance/${id}`, data),
  delete: (id) => api.delete(`/insurance/${id}`),
  search: (query) => api.get('/insurance/search', { params: { query } }),
  exportExcel: (patientId) => api.get(`/insurance/patient/${patientId}/export/excel`, {
    responseType: 'blob'
  })
};
