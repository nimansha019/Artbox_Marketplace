import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { orderService } from '../services';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
  const { navigate, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guest order tracking state
  const [guestOrderId, setGuestOrderId] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestOrder, setGuestOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      setOrders(response.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackGuestOrder = async () => {
    if (!guestOrderId.trim() || !guestEmail.trim()) {
      toast.error('Please enter both order ID and email');
      return;
    }

    setTrackingOrder(true);
    try {
      // For guest orders, we'll use the getOrder endpoint with the order ID
      // The backend will handle guest order access
      const response = await orderService.getOrder(guestOrderId.trim());
      setGuestOrder(response.order);
      toast.success('Order found!');
    } catch (error) {
      toast.error('Order not found. Please check your order ID and email.');
      setGuestOrder(null);
    } finally {
      setTrackingOrder(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '⚙️';
      case 'pending': return '⏳';
      default: return '📦';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {user ? 'My Orders' : 'Track Your Order'}
            </h1>
            <p className="text-gray-600">
              {user ? 'Track your order history and status' : 'Enter your order details to track your purchase'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          // Guest Order Tracking
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Track Your Order</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={guestOrderId}
                    onChange={(e) => setGuestOrderId(e.target.value)}
                    placeholder="Enter your order ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D5A06D] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Enter the email used for order"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D5A06D] focus:border-transparent"
                  />
                </div>
                <button
                  onClick={trackGuestOrder}
                  disabled={trackingOrder}
                  className="w-full py-2 px-4 bg-[#D5A06D] text-white rounded-md hover:bg-[#c49a5d] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {trackingOrder ? 'Searching...' : 'Track Order'}
                </button>
              </div>
            </div>

            {/* Display tracked guest order */}
            {guestOrder && (
              <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Order #{guestOrder._id}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(guestOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        LKR {guestOrder.totalAmount?.toLocaleString() || 'N/A'}
                      </p>
                      <div className="flex items-center justify-end mt-1">
                        <span className="text-lg mr-2">{getStatusIcon(guestOrder.status)}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(guestOrder.status)}`}>
                          {guestOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {guestOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.product?.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × LKR {item.price?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          LKR {(item.quantity * item.price)?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {guestOrder.shippingAddress && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {guestOrder.shippingAddress.street}, {guestOrder.shippingAddress.city},{' '}
                      {guestOrder.shippingAddress.state}, {guestOrder.shippingAddress.country}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // User Orders (existing logic)
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5A06D] mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 bg-[#D5A06D] text-white rounded-md hover:bg-[#c49a5d]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">Placed on {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">LKR {order.total.toLocaleString()}</p>
                          <div className="flex items-center justify-end mt-1">
                            <span className="text-lg mr-2">{getStatusIcon(order.status)}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-2xl">🛍️</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">LKR {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-600">{order.address}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h4>
                      <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                      Track Order
                    </button>
                    <button className="px-4 py-2 text-sm bg-[#D5A06D] text-white rounded hover:bg-[#c49a5d]">
                      View Invoice
                    </button>
                    {order.status === 'Delivered' && (
                      <button className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;