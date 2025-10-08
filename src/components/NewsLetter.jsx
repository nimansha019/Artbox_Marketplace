import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { newsletterService } from '../services';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await newsletterService.subscribe(email);
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
      <h1 className="md:text-4xl text-2xl font-semibold text-[#3B6255]">
        Never Miss a Deal...!
      </h1>
      <p className="md:text-lg text-gray-500/70 pb-8">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts
      </p>
      <form onSubmit={handleSubmit} className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500 placeholder-gray-400"
          placeholder="Enter your email address"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="md:px-12 px-8 h-full text-white bg-[#D5A06D] hover:bg-[#D5A06D] transition-all cursor-pointer rounded-md rounded-l-none disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsLetter;