import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets, dummyAddress } from '../assets/assets';
import StripeCheckout from '../components/StripeCheckout';
import { toast } from 'react-hot-toast';
import { orderService } from '../services';
import { addressService } from '../services';

const Cart = () => {
    const {
        products,
        cartItems,
        removeFromCart,
        getCartItemCount,
        updateCartItem,
        navigate,
        getCartAmount,
        user,
        setCartItems // Make sure this is added to your context
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [address, setAddress] = useState(dummyAddress);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]);
    const [paymentOption, setPaymentOption] = useState("COD");
    const [showStripeCheckout, setShowStripeCheckout] = useState(false);

    // Guest checkout state
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Load addresses on component mount
    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const response = await addressService.getUserAddresses();
            if (response.addresses && response.addresses.length > 0) {
                setAddress(response.addresses);
                setSelectedAddress(response.addresses[0]);
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
            // Keep dummy address as fallback
        }
    };

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
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        // Validate guest information if guest checkout
        if (isGuestCheckout) {
            if (!guestInfo.name || !guestInfo.email) {
                toast.error('Please provide your name and email for guest checkout');
                return;
            }
        }

        if (paymentOption === "Online") {
            setShowStripeCheckout(true);
            return;
        }

        console.log('Processing COD payment');
        try {
            let orderData;

            if (isGuestCheckout) {
                // Guest order data
                orderData = {
                    items: cartArray.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                        price: item.offerPrice || item.price
                    })),
                    shippingAddress: selectedAddress,
                    paymentMethod: 'COD',
                    guestInfo: guestInfo
                };

                const response = await orderService.createGuestOrder(orderData);
                toast.success('Order placed successfully! You will receive order updates via email.');
            } else {
                // Regular user order data
                orderData = {
                    items: cartArray.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                        price: item.offerPrice
                    })),
                    shippingAddress: selectedAddress,
                    paymentMethod: 'COD'
                };

                const response = await orderService.createOrder(orderData);
                toast.success('Order placed successfully!');
            }

            // Clear cart and redirect to orders
            setCartItems({});
            navigate('/my-orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        }
    };

    const handlePaymentSuccess = async (paymentIntent, orderData) => {
        try {
            let response;
            if (isGuestCheckout) {
                // Guest order data for online payment
                const guestOrderData = {
                    items: cartArray.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                        price: item.offerPrice || item.price
                    })),
                    shippingAddress: {
                        street: selectedAddress.street,
                        city: selectedAddress.city,
                        state: selectedAddress.state,
                        country: selectedAddress.country,
                        zipCode: selectedAddress.zipcode || selectedAddress.zipCode,
                        phone: selectedAddress.phone
                    },
                    paymentMethod: 'online',
                    guestInfo: guestInfo
                };

                console.log('Creating guest order:', guestOrderData);
                response = await orderService.createGuestOrder(guestOrderData);
                console.log('Guest order response:', response);
            } else {
                // Regular user order data for online payment
                const userOrderData = {
                    items: cartArray.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                        price: item.offerPrice
                    })),
                    shippingAddress: {
                        street: selectedAddress.street,
                        city: selectedAddress.city,
                        state: selectedAddress.state,
                        country: selectedAddress.country,
                        zipCode: selectedAddress.zipcode || selectedAddress.zipCode,
                        phone: selectedAddress.phone
                    },
                    paymentMethod: 'online'
                };

                console.log('Creating user order:', userOrderData);
                response = await orderService.createOrder(userOrderData);
                console.log('User order response:', response);
            }

            // Check if order creation was successful
            if (response && response.success) {
                const orderId = response.order?._id || response.order?.id;
                if (isGuestCheckout && orderId) {
                    toast.success(`Payment successful! Order placed. Your order ID is: ${orderId}. You will receive order updates via email.`);
                } else {
                    toast.success('Payment successful! Order placed. You will receive order updates via email.');
                }
                setShowStripeCheckout(false);
                setCartItems({});
                navigate('/my-orders');
            } else {
                throw new Error(response?.message || 'Order creation failed');
            }
        } catch (error) {
            console.error('Order creation error:', error);
            toast.error(error.response?.data?.message || error.message || 'Payment successful but order creation failed. Please contact support.');
            // Don't close the modal so user can try again
        }
    };

    const handlePaymentCancel = () => {
        console.log('Payment cancelled by user');
        setShowStripeCheckout(false);
    };

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    // Single return statement with conditional rendering
    return (
        <>
            {products.length > 0 && Object.keys(cartItems).length > 0 ? (
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

                        {/* Guest Checkout Option */}
                        {!user && (
                            <div className="mb-6">
                                <p className="text-sm font-medium uppercase mb-3">Checkout As</p>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="checkoutType"
                                            checked={!isGuestCheckout}
                                            onChange={() => setIsGuestCheckout(false)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Login to checkout</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="checkoutType"
                                            checked={isGuestCheckout}
                                            onChange={() => setIsGuestCheckout(true)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Checkout as guest</span>
                                    </label>
                                </div>

                                {!isGuestCheckout && (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full py-2 mt-3 bg-[#3B6255] text-white text-sm font-medium hover:bg-[#2a4a3a] transition"
                                    >
                                        Login to Continue
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Guest Information Form */}
                        {isGuestCheckout && (
                            <div className="mb-6">
                                <p className="text-sm font-medium uppercase mb-3">Guest Information</p>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name *"
                                        value={guestInfo.name}
                                        onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                                        className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address *"
                                        value={guestInfo.email}
                                        onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                                        className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number (optional)"
                                        value={guestInfo.phone}
                                        onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                                        className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
                                    />
                                </div>
                            </div>
                        )}

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
            )}

            {/* Stripe Checkout Modal - Now properly included in single return */}
            {showStripeCheckout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <StripeCheckout
                        amount={parseInt(getCartAmount() + getCartAmount() * 2 / 100, 10)}
                        onSuccess={handlePaymentSuccess}
                        onCancel={handlePaymentCancel}
                        isGuestCheckout={isGuestCheckout}
                        orderData={{
                            items: cartArray.map(item => ({
                                product: item._id,
                                quantity: item.quantity,
                                price: item.offerPrice || item.price
                            })),
                            shippingAddress: {
                                street: selectedAddress.street,
                                city: selectedAddress.city,
                                state: selectedAddress.state,
                                country: selectedAddress.country,
                                zipCode: selectedAddress.zipcode || selectedAddress.zipCode,
                                phone: selectedAddress.phone
                            },
                            paymentMethod: 'online',
                            guestInfo: isGuestCheckout ? guestInfo : null
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default Cart;