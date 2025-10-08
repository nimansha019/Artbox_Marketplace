import axios from 'axios';
import api from '../utils/api';

// Create a separate axios instance for public order endpoints (no auth required)
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to publicApi for better error handling
publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Public API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const orderService = {
  // Get user's orders
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create guest order (no authentication required)
  createGuestOrder: async (orderData) => {
    const response = await publicApi.post('/orders/guest', orderData);
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async () => {
    const response = await api.get('/orders/admin/orders');
    return response.data;
  },

  // Create order (authenticated user)
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};