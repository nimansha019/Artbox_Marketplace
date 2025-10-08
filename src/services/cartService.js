import api from '../utils/api';

export const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (productId, quantity) => {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};