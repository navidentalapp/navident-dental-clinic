import api from './api';

export const prescriptionService = {
  getAll: (params = {}) => api.get('/prescriptions', { params }),
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  delete: (id) => api.delete(`/prescriptions/${id}`),
  search: (query) => api.get('/prescriptions/search', { params: { query } }),
  generatePdf: (id) => api.get(`/prescriptions/${id}/pdf`, { responseType: 'blob' }),
  exportExcel: (startDate, endDate) => api.get('/prescriptions/export/excel', {
    params: { start: startDate, end: endDate },
    responseType: 'blob'
  })
};
