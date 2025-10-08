import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/login.jsx';
import AllProducts from './pages/AllProducts';
import { AppProvider } from "./context/AppContext";
import ProductCategory from "./pages/PCategories"; // ✅ matches file name
import ProductDetails from "./pages/ProductDetails";
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress.jsx';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminNewsletter from './pages/AdminNewsletter';
import AdminOrders from './pages/AdminOrders';
import MyOrders from './pages/MyOrders';

const App = () => {
  const isSellerPath = useLocation().pathname.includes("admin"); // consistent naming
  const {showUserLogin}= useAppContext()
  return (
    <div>
      {!isSellerPath && <Navbar />}
      {showUserLogin? <Login/> : null}


      <Toaster position="top-right" reverseOrder={false} />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />}   />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
