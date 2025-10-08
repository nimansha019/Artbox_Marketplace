import axios from 'axios';
import api from '../utils/api';

// Create a separate axios instance for public category endpoints (no auth required)
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryService = {
  // Get all categories (public)
  getAllCategories: async () => {
    const response = await publicApi.get('/categories');
    return response.data;
  },

  // Create category (admin)
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category (admin)
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category (admin)
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};