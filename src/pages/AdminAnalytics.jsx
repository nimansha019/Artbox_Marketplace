import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { analyticsService } from '../services';
import { toast } from 'react-hot-toast';

const AdminAnalytics = () => {
  const { navigate } = useAppContext();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [dashboard, revenue, products, customers] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getRevenueData(),
        analyticsService.getProductPerformance(),
        analyticsService.getCustomerAnalytics()
      ]);

      setAnalytics({
        ...dashboard.stats,
        monthlyRevenue: revenue.data,
        topProducts: products.data,
        customerStats: customers.data
      });
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your store performance and insights</p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5A06D] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">R</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">LKR {analytics.totalRevenue?.toLocaleString() || 0}</p>
                    <p className="text-sm text-green-600">+12% from last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">O</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders || 0}</p>
                    <p className="text-sm text-green-600">+8% from last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">LKR {analytics.averageOrderValue || 0}</p>
                    <p className="text-sm text-green-600">+5% from last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">C</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers || 0}</p>
                    <p className="text-sm text-green-600">+15% from last month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Revenue</h2>
              <div className="h-64 flex items-end justify-between space-x-2">
                {analytics.monthlyRevenue?.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-[#D5A06D] rounded-t"
                      style={{ height: `${(data.revenue / 30000) * 100}%` }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                    <p className="text-xs font-medium text-gray-900">LKR {data.revenue?.toLocaleString() || 0}</p>
                  </div>
                )) || []}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Products */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Selling Products</h2>
                <div className="space-y-4">
                  {analytics.topProducts?.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#D5A06D] rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} sales</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">LKR {product.revenue?.toLocaleString() || 0}</p>
                    </div>
                  )) || []}
                </div>
              </div>

              {/* Customer Stats */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Insights</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Customers</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.customerStats?.newCustomers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Returning Customers</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.customerStats?.returningCustomers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Orders per Customer</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.customerStats?.averageOrdersPerCustomer || 0}</span>
                  </div>
                </div>

                {/* Customer Distribution Chart */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Distribution</h3>
                  <div className="flex h-4 bg-gray-200 rounded">
                    <div
                      className="bg-green-500 rounded-l"
                      style={{ width: `${((analytics.customerStats?.newCustomers || 0) / (analytics.totalCustomers || 1)) * 100}%` }}
                    ></div>
                    <div
                      className="bg-blue-500 rounded-r"
                      style={{ width: `${((analytics.customerStats?.returningCustomers || 0) / (analytics.totalCustomers || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>New ({analytics.customerStats?.newCustomers || 0})</span>
                    <span>Returning ({analytics.customerStats?.returningCustomers || 0})</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;