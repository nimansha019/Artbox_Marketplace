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




const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller"); // consistent naming
  const {showUserLogin}= useAppContext()
  return (
    <div>
      {isSellerPath ? null : <Navbar />}
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
          {/* Add more routes as needed */}   
        </Routes>
      </div>
      
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
