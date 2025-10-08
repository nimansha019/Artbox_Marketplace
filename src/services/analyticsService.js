import api from '../utils/api';

export const analyticsService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  // Get revenue data
  getRevenueData: async () => {
    const response = await api.get('/analytics/revenue');
    return response.data;
  },

  // Get product performance
  getProductPerformance: async () => {
    const response = await api.get('/analytics/products');
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async () => {
    const response = await api.get('/analytics/customers');
    return response.data;
  },
};