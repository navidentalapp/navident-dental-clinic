import api from './api';

export const patientService = {
  getAll: (params = {}) => {
    return api.get('/patients', { params });
  },
  
  getById: (id) => {
    return api.get(`/patients/${id}`);
  },
  
  create: (patientData) => {
    return api.post('/patients', patientData);
  },
  
  update: (id, patientData) => {
    return api.put(`/patients/${id}`, patientData);
  },
  
  delete: (id) => {
    return api.delete(`/patients/${id}`);
  },
  
  search: (query) => {
    return api.get('/patients/search', { params: { query } });
  },
  
  exportExcel: () => {
    return api.get('/patients/export/excel', {
      responseType: 'blob'
    });
  },
  
  generatePdf: (id) => {
    return api.get(`/patients/${id}/pdf`, {
      responseType: 'blob'
    });
  }
};
