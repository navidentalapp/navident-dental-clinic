import api from './api';

export const dentistService = {
  getAll: (params = {}) => {
    return api.get('/dentists', { params });
  },
  
  getById: (id) => {
    return api.get(`/dentists/${id}`);
  },
  
  create: (dentistData) => {
    return api.post('/dentists', dentistData);
  },
  
  update: (id, dentistData) => {
    return api.put(`/dentists/${id}`, dentistData);
  },
  
  delete: (id) => {
    return api.delete(`/dentists/${id}`);
  },
  
  search: (query) => {
    return api.get('/dentists/search', { params: { query } });
  },
  
  getActive: () => {
    return api.get('/dentists/active');
  },
  
  exportExcel: () => {
    return api.get('/dentists/export/excel', {
      responseType: 'blob'
    });
  },
  
  generatePdf: (id) => {
    return api.get(`/dentists/${id}/pdf`, {
      responseType: 'blob'
    });
  }
};
