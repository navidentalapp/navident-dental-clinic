import api from './api';

export const financeService = {
  getAll: (params = {}) => api.get('/finance', { params }),
  getById: (id) => api.get(`/finance/${id}`),
  create: (data) => api.post('/finance', data),
  update: (id, data) => api.put(`/finance/${id}`, data),
  delete: (id) => api.delete(`/finance/${id}`),
  search: (query) => api.get('/finance/search', { params: { query } }),
  exportExcel: (startDate, endDate) => api.get('/finance/export/excel', {
    params: { start: startDate, end: endDate },
    responseType: 'blob'
  })
};
