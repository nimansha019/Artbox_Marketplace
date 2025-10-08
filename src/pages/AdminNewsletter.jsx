import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { newsletterService } from '../services';

const AdminNewsletter = () => {
  const { navigate } = useAppContext();
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    recipientType: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const response = await newsletterService.getSubscribers();
      setSubscribers(response.subscribers || []);
    } catch (error) {
      toast.error('Failed to load subscribers');
      console.error('Failed to load subscribers:', error);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.subject || !formData.content) {
      toast.error('Please fill in subject and content');
      setLoading(false);
      return;
    }

    try {
      await newsletterService.sendNewsletter(formData);
      toast.success('Newsletter sent successfully!');
      setFormData({ subject: '', content: '', recipientType: 'all' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriber = async (subscriberId) => {
    try {
      await newsletterService.removeSubscriber(subscriberId);
      toast.success('Subscriber removed successfully!');
      // Reload subscribers
      loadSubscribers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove subscriber');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
              <p className="text-gray-600">Send newsletters and manage subscribers</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Send Newsletter */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Send Newsletter</h2>
            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Newsletter subject"
                  required
                />
              </div>

              <div>
                <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700">
                  Recipients
                </label>
                <select
                  id="recipientType"
                  name="recipientType"
                  value={formData.recipientType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Subscribers ({subscribers.length})</option>
                  <option value="new">New Subscribers (Last 30 days)</option>
                  <option value="active">Active Customers</option>
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Write your newsletter content here..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-[#D5A06D] text-white rounded-md hover:bg-[#c49a5d] disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Newsletter'}
              </button>
            </form>
          </div>

          {/* Newsletter Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Newsletter Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Subscribers</span>
                <span className="text-lg font-semibold text-gray-900">{subscribers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New This Month</span>
                <span className="text-lg font-semibold text-green-600">+3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Open Rate</span>
                <span className="text-lg font-semibold text-gray-900">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Click Rate</span>
                <span className="text-lg font-semibold text-gray-900">24%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unsubscribed</span>
                <span className="text-lg font-semibold text-red-600">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subscribers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingSubscribers ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D5A06D]"></div>
                      </div>
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No subscribers yet
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscriber.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscriber.subscribedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;