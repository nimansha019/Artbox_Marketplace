import axios from 'axios';

// Create a separate axios instance for public payment endpoints (no auth required)
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const paymentService = {
  // Create payment intent (public endpoint for guest checkout)
  createIntent: async (paymentData) => {
    const response = await publicApi.post('/payments/create-intent', paymentData);
    return response.data;
  },

  // Confirm payment (public endpoint for guest checkout)
  confirmPayment: async (paymentData) => {
    const response = await publicApi.post('/payments/confirm', paymentData);
    return response.data;
  },
};