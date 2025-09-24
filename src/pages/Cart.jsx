import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';  
import { assets, dummyAddress } from '../assets/assets';

const Cart = () => {
    const {
        products,
        cartItems,
        removeFromCart,
        getCartItemCount,
        updateCartItem,
        navigate,
        getCartAmount
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [address, setAddress] = useState(dummyAddress);  
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]);
    const [paymentOption, setPaymentOption] = useState("COD");

    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find(
                (item) => String(item._id) === String(key) || String(item.id) === String(key)
            );
            if (product) {
                tempArray.push({ ...product, quantity: Number(cartItems[key]) || 0 });
            }
        }   
        setCartArray(tempArray);
    };

    const placeOrder = async () => {
        console.log("Order placed with:", { cartArray, selectedAddress, paymentOption });
    };

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    return products.length > 0 && Object.keys(cartItems).length > 0 ? (
        <div className="flex flex-col md:flex-row mt-16">
            {/* Left Section */}
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-[#3B6255]">Items - {getCartItemCount()} </span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div 
                                onClick={() => {
                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                    scrollTo(0,0);
                                }} 
                                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                            >
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Size: <span>{product.size || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select
                                            className='outline-none'
                                            value={product.quantity}
                                            onChange={(e) => updateCartItem(product._id, parseInt(e.target.value))}
                                        >
                                            {Array.from({ length: product.quantity > 9 ? product.quantity : 9 }).map((_, idx) => (
                                                <option key={idx} value={idx + 1}>{idx + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">
                          LKR {parseInt(Number(product.offerPrice) * Number(product.quantity), 10)}
                        </p>
                        <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">  
                           <img src={assets.remove_icon} alt="Remove" className="inline-block w-6 h-6" />
                        </button>
                    </div>
                ))}

                <button 
                    onClick={()=> {navigate("/products"); scrollTo(0,0)}} 
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-[#3B6255] font-medium"
                >
                    <img className='group-hover:-translate-x-1 transition' src={assets.arrow_right_icon_colored} alt="arrow"/>
                    Continue Shopping
                </button>
            </div>

            {/* Right Section */}
            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">
                          {selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}
                        </p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-indigo-500 hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                               {address.map((addr,index)=>( 
                                <p key={index} onClick={() => {setSelectedAddress(addr); setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                  {addr.street}, {addr.city}, {addr.state}, {addr.country}
                                </p>
                                 ))}
                                <p onClick={() => navigate("/add-address")} className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
                    <select 
                        onChange={e => setPaymentOption(e.target.value)} 
                        className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
                        value={paymentOption}
                    >
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span>
                        <span>LKR {parseInt(getCartAmount(), 10)}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span>
                        <span>LKR {parseInt(getCartAmount() * 2 / 100, 10)}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span>
                        <span>LKR {parseInt(getCartAmount() + getCartAmount() * 2 / 100, 10)}</span>
                    </p>
                </div>

                <button 
                    onClick={placeOrder}
                    className="w-full py-3 mt-6 cursor-pointer bg-[#D5A06D] text-white font-medium hover:bg-indigo-600 transition"
                >
                    {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ) : (
        <p className="text-center text-gray-500 mt-16">Your cart is empty</p>
    );
};

export default Cart;
