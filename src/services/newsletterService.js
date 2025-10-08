import axios from 'axios';
import api from '../utils/api';

// Create a separate axios instance for public newsletter endpoints (no auth required)
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const newsletterService = {
  // Subscribe to newsletter (public)
  subscribe: async (email) => {
    const response = await publicApi.post('/newsletter/subscribe', { email });
    return response.data;
  },

  // Send newsletter (admin)
  sendNewsletter: async (newsletterData) => {
    const response = await api.post('/newsletter/send', newsletterData);
    return response.data;
  },

  // Get subscribers (admin)
  getSubscribers: async () => {
    const response = await api.get('/newsletter/subscribers');
    return response.data;
  },

  // Remove subscriber (admin)
  removeSubscriber: async (id) => {
    const response = await api.delete(`/newsletter/subscribers/${id}`);
    return response.data;
  },
};