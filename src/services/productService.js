import axios from 'axios';
import api from '../utils/api';

// Create a separate axios instance for public product endpoints (no auth required)
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  // Get all products (public)
  getAllProducts: async () => {
    const response = await publicApi.get('/products');
    return response.data;
  },

  // Get single product (public)
  getProduct: async (id) => {
    const response = await publicApi.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category (public)
  getProductsByCategory: async (category) => {
    const response = await publicApi.get(`/products/category/${category}`);
    return response.data;
  },

  // Create product (admin)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Toggle product availability (admin)
  toggleAvailability: async (id) => {
    const response = await api.patch(`/products/${id}/availability`);
    return response.data;
  },
};