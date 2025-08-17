import api from './api';

export const authService = {
  login: (credentials) => {
    return api.post('/auth/signin', credentials);
  },
  
  register: (userData) => {
    return api.post('/auth/signup', userData);
  },
  
  refreshToken: (username) => {
    return api.post('/auth/refresh', null, {
      params: { username }
    });
  }
};
