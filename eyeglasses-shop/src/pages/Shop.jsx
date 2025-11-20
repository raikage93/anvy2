import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import { products } from '../data/products';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  
  const categoryRef = useRef(null);
  const priceRef = useRef(null);

  const categories = ['All', 'Eyeglasses', 'Sunglasses'];
  const prices = ['All', 'Under $300', '$300+'];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target)) {
        setPriceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const priceMatch = priceRange === 'All' || 
      (priceRange === 'Under $300' ? product.price < 300 : product.price >= 300);
    return categoryMatch && priceMatch;
  });

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center">Shop Collection</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-6 border-b border-gray-100">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Filter size={20} className="text-gray-400" />
            <span className="font-medium">Filter by:</span>
            
            <div className="relative" ref={categoryRef}>
              <button 
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-black"
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={16} className={`transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-10 border border-gray-100">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedCategory === cat ? 'font-bold text-secondary' : 'text-gray-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={priceRef}>
              <button 
                onClick={() => setPriceDropdownOpen(!priceDropdownOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-black"
              >
                <span>Price: {priceRange}</span>
                <ChevronDown size={16} className={`transition-transform ${priceDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {priceDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-10 border border-gray-100">
                  {prices.map(price => (
                    <button
                      key={price}
                      onClick={() => {
                        setPriceRange(price);
                        setPriceDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${priceRange === price ? 'font-bold text-secondary' : 'text-gray-600'}`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-500 text-sm">{filteredProducts.length} products found</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[4/5]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-serif font-bold mb-1 group-hover:text-secondary transition-colors">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <span className="font-medium">${product.price}</span>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No products found matching your criteria.</p>
            <button 
              onClick={() => {setSelectedCategory('All'); setPriceRange('All');}}
              className="mt-4 text-secondary font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
