
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  const { 
    user, 
    setUser, 
    setShowUserLogin, 
    setSearchQuery, 
    searchQuery, 
    getCartItemCount 
  } = useAppContext();

  const logout = () => {
    setUser(null);
    navigate('/');
    setOpen(false);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-20 w-auto" src={assets.logo4} alt="Logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Products</NavLink>
        <NavLink to="/">Contact</NavLink>
      </div>

      {/* Search Bar */}
      <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
          type="text"
          placeholder="Search products"
        />
        <img src={assets.search_icon} alt="Search" className="h-4 w-4" />
      </div>

      {/* Cart */}
      <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
        <img src={assets.nav_cart_icon} alt="Cart" className="w-6 opacity-80" />
        <button className="absolute -top-2 -right-3 text-xs text-black bg-[#D5A06D] w-[18px] h-[18px] rounded-full">
          {getCartItemCount()}
        </button>
      </div>

      {/* User/Login */}
      <div>
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-[#D5A06D] hover:bg-yellow-400 transition text-black rounded-full"
          >
            Login
          </button>
        ) : (
          <div className='relative group'>
            <img src={assets.profile_icon} alt="User" className='w-10'/>
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow-md border border-gray-200 rounded-md py-2.5 w-30 text-sm z-40'>
              <li onClick={() => navigate("/my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My orders</li>
              <li onClick={logout} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">Logout</li>
            </ul>
          </div>
        )}
      </div>

    
      <div className='flex items-center gap-6 sm:hidden'>
       
       {/* mobile navigation menu*/}
      
      <button onClick={() => setOpen(!open)} aria-label="Menu" className="">
        <img src={assets.menu_icon} alt="Menu"/>
      </button>
      </div>
     
      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>All Products</NavLink>
          {user && <NavLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</NavLink>}
          <NavLink to="/" onClick={() => setOpen(false)}>Contact</NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-green-500 hover:bg-green-400 transition text-black rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-green-500 hover:bg-green-400 transition text-black rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
