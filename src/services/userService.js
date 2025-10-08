import api from '../utils/api';

export const userService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/user/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/user/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/user/logout');
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
};