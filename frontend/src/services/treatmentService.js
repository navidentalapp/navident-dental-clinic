import api from './api';

export const treatmentService = {
  getAll: (params = {}) => {
    return api.get('/treatments', { params });
  },
  
  getById: (id) => {
    return api.get(`/treatments/${id}`);
  },
  
  create: (treatmentData) => {
    return api.post('/treatments', treatmentData);
  },
  
  update: (id, treatmentData) => {
    return api.put(`/treatments/${id}`, treatmentData);
  },
  
  delete: (id) => {
    return api.delete(`/treatments/${id}`);
  },
  
  search: (query) => {
    return api.get('/treatments/search', { params: { query } });
  },
  
  getActive: () => {
    return api.get('/treatments/active');
  }
};
