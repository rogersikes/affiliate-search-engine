import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Find what you're looking for</h1>
        <p className="text-xl text-gray-600">Search for products and earn commissions through our affiliate program</p>
      </div>
      
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you looking for today?"
            className="w-full px-4 py-3 rounded-l-lg border-2 border-r-0 border-blue-500 focus:outline-none"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-blue-600 transition"
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Find Products</h3>
          <p className="text-gray-600">Search from thousands of products from top retailers</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Earn Commissions</h3>
          <p className="text-gray-600">Get paid when people buy through your unique links</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Support Charities</h3>
          <p className="text-gray-600">Part of your earnings go to a charity of your choice</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
