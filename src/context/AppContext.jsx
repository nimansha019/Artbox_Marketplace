import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import { toast } from "react-hot-toast";
import { userService, productService, cartService } from "../services";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Load cart from API
  const loadCart = async () => {
    if (!user) return;
    try {
      const response = await cartService.getCart();
      const cartData = {};
      response.cart.forEach(item => {
        cartData[item.product._id] = item.quantity;
      });
      setCartItems(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems({});
    }
  }, [user]);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await userService.login(credentials);
      const { token, user: userData } = response;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsSeller(userData.role === 'admin');
      setShowUserLogin(false);

      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await userService.register(userData);
      toast.success('Registration successful! Please login.');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsSeller(false);
      setCartItems({});
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await userService.getProfile();
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to dummy data if API fails
      setProducts(dummyProducts);
      toast.error('Failed to load products, showing demo data');
    }
  };

  const fetchProductsByCategory = async (category) => {
    try {
      const response = await productService.getProductsByCategory(category);
      return response.products || [];
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      // Fallback to filtering dummy data
      return dummyProducts.filter(product => product.category === category);
    }
  };

  const addToCart = async (itemID) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemID]) {
      cartData[itemID] += 1;
    } else {
      cartData[itemID] = 1;
    }

    setCartItems(cartData);

    // Sync with API if user is logged in
    if (user) {
      try {
        await cartService.addToCart(itemID, cartData[itemID]);
      } catch (error) {
        console.error('Failed to sync cart:', error);
        // Revert local change on API failure
        cartData[itemID] -= 1;
        if (cartData[itemID] === 0) delete cartData[itemID];
        setCartItems(cartData);
        toast.error('Failed to add item to cart');
        return;
      }
    }

    toast.success("Item added to cart");
  };

  const updateCartItem = async (itemID, quantity) => {
    let cartData = structuredClone(cartItems);
    const oldQuantity = cartData[itemID] || 0;
    cartData[itemID] = quantity;

    if (quantity === 0) delete cartData[itemID];
    setCartItems(cartData);

    // Sync with API if user is logged in
    if (user) {
      try {
        if (quantity === 0) {
          await cartService.removeFromCart(itemID);
        } else {
          await cartService.updateCartItem(itemID, quantity);
        }
      } catch (error) {
        console.error('Failed to sync cart:', error);
        // Revert local change on API failure
        cartData[itemID] = oldQuantity;
        if (oldQuantity === 0) delete cartData[itemID];
        setCartItems(cartData);
        toast.error('Failed to update cart');
        return;
      }
    }

    toast.success("Cart updated");
  };

  const removeFromCart = async (itemID) => {
    let cartData = structuredClone(cartItems);
    const oldQuantity = cartData[itemID] || 0;

    if (cartData[itemID]) {
      cartData[itemID] -= 1;
      if (cartData[itemID] === 0) delete cartData[itemID];
    }

    setCartItems(cartData);

    // Sync with API if user is logged in
    if (user) {
      try {
        if (oldQuantity <= 1) {
          await cartService.removeFromCart(itemID);
        } else {
          await cartService.updateCartItem(itemID, cartData[itemID] || 0);
        }
      } catch (error) {
        console.error('Failed to sync cart:', error);
        // Revert local change on API failure
        cartData[itemID] = oldQuantity;
        setCartItems(cartData);
        toast.error('Failed to remove item from cart');
        return;
      }
    }

    toast.success("Item removed from cart");
  };

  const getCartItemCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += Number(cartItems[item]) || 0;
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      let itemInfo = products.find(
        (product) => String(product._id) === String(item) || String(product.id) === String(item)
      );
      if (itemInfo && cartItems[item] > 0) {
        const price = Number(itemInfo.offerPrice) || 0;
        const qty = Number(cartItems[item]) || 0;
        totalAmount += price * qty;
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    getCartItemCount,
    getCartAmount,
    login,
    register,
    logout,
    getProfile,
    loading,
    fetchProductsByCategory,
    loadCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
