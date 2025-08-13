import api from './api';

export const billService = {
  getAll: (params = {}) => {
    return api.get('/bills', { params });
  },
  
  getById: (id) => {
    return api.get(`/bills/${id}`);
  },
  
  create: (billData) => {
    return api.post('/bills', billData);
  },
  
  update: (id, billData) => {
    return api.put(`/bills/${id}`, billData);
  },
  
  delete: (id) => {
    return api.delete(`/bills/${id}`);
  },
  
  search: (query) => {
    return api.get('/bills/search', { params: { query } });
  },
  
  generatePdf: (id) => {
    return api.get(`/bills/${id}/pdf`, {
      responseType: 'blob'
    });
  },
  
  exportExcel: (patientId) => {
    return api.get(`/bills/patient/${patientId}/export/excel`, {
      responseType: 'blob'
    });
  }
};
