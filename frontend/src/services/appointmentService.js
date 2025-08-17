import api from './api';

export const appointmentService = {
  getAll: (params = {}) => {
    return api.get('/appointments', { params });
  },
  
  getById: (id) => {
    return api.get(`/appointments/${id}`);
  },
  
  create: (appointmentData) => {
    return api.post('/appointments', appointmentData);
  },
  
  update: (id, appointmentData) => {
    return api.put(`/appointments/${id}`, appointmentData);
  },
  
  delete: (id) => {
    return api.delete(`/appointments/${id}`);
  },
  
  getToday: () => {
    return api.get('/appointments/today');
  },
  
  getByDate: (date) => {
    return api.get(`/appointments/date/${date}`);
  },
  
  search: (query) => {
    return api.get('/appointments/search', { params: { query } });
  },
  
  exportExcel: (startDate, endDate) => {
    return api.get('/appointments/export/excel', {
      params: { startDate, endDate },
      responseType: 'blob'
    });
  }
};
