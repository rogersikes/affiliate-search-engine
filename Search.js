import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    if (queryParam) {
      setQuery(queryParam);
      searchProducts(queryParam);
    }
  }, [location.search]);

  // Search for products
  const searchProducts = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use authenticated endpoint if logged in, otherwise use public
      const endpoint = currentUser 
        ? '/search/products' 
        : '/search/public/products';
      
      const response = await axios.get(endpoint, {
        params: { query: searchQuery }
      });
      
      setProducts(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Handle product click
  const handleProductClick = async (product) => {
    if (!currentUser) {
      // Save selected product to localStorage for after login
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      navigate('/login');
      return;
    }
    
    // Record click if user is logged in
    try {
      await axios.post('/affiliate/click', {
        product_id: product.id,
        affiliate_network: product.source
      });
    } catch (err) {
      console.error("Failed to record click:", err);
    }
    
    // Navigate to product page or external link
    navigate(`/product/${product.id}`);
  };

  return (
    <div>
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for today?"
            className="w-full px-4 py-2 rounded-l-lg border-2 border-r-0 border-blue-500 focus:outline-none"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r-lg font-semibold hover:bg-blue-600 transition"
          >
            Search
          </button>
        </form>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Searching for products...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found. Try a different search term.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => handleProductClick(product)}
          >
            <div className="h-48 bg-gray-200">
              {/* In a real app, use actual product images */}
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Product Image
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">From {product.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!currentUser && products.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-blue-700">
            Sign in to earn commissions on these products!
          </p>
        </div>
