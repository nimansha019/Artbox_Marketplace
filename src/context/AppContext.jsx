import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import { toast } from "react-hot-toast";

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

  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };

  const addToCart = (itemID) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemID]) {
      cartData[itemID] += 1;
    } else {
      cartData[itemID] = 1;
    }

    setCartItems(cartData);
    toast.success("Item added to cart");
  };

  const updateCartItem = (itemID, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemID] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  const removeFromCart = (itemID) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemID]) {
      cartData[itemID] -= 1;
      if (cartData[itemID] === 0) delete cartData[itemID];
    }
    setCartItems(cartData);
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
    searchQuery,
    setSearchQuery,
    getCartItemCount,
    getCartAmount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
