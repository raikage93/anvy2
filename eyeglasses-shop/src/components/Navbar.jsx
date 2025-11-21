import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getCartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-bold tracking-tighter">
          ANVY CLINIC
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-secondary transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-sm font-medium hover:text-secondary transition-colors">
            Shop
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-secondary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-secondary transition-colors">
            Contact
          </Link>
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="hover:text-secondary transition-colors">
            <Search size={20} />
          </button>
          <Link to="/cart" className="relative hover:text-secondary transition-colors">
            <ShoppingBag size={20} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-6 flex flex-col space-y-4">
          <Link
            to="/"
            className="text-lg font-medium hover:text-secondary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-lg font-medium hover:text-secondary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-lg font-medium hover:text-secondary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium hover:text-secondary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
             <Link to="/cart" className="flex items-center space-x-2 text-lg font-medium hover:text-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingBag size={20} />
                <span>Cart ({getCartCount()})</span>
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
