import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getCartCount } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-md py-3' 
          : 'bg-white/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-primary hover:text-secondary transition-all duration-300 transform hover:scale-105"
        >
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ANVY
          </span>
          <span className="text-primary ml-2">CLINIC</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                isActive(link.path)
                  ? 'text-secondary'
                  : 'text-gray-700 hover:text-secondary'
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-secondary transition-all duration-300 ${
                  isActive(link.path) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="hidden lg:flex items-center space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 text-gray-700 hover:text-secondary"
            aria-label="Search"
          >
            <Search size={20} strokeWidth={2} />
          </button>
          <Link 
            to="/cart" 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 text-gray-700 hover:text-secondary group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} strokeWidth={2} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-primary active:scale-95"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={26} strokeWidth={2} className="text-secondary" />
          ) : (
            <Menu size={26} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-gray-200 shadow-xl">
          <div className="container mx-auto px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-secondary/10 text-secondary border-l-4 border-secondary'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-secondary hover:translate-x-2'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                to="/cart"
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-secondary/10 transition-all duration-300 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <ShoppingBag 
                    size={22} 
                    strokeWidth={2}
                    className="text-gray-700 group-hover:text-secondary transition-colors"
                  />
                  <span className="text-base font-medium text-gray-700 group-hover:text-secondary transition-colors">
                    Shopping Cart
                  </span>
                </div>
                {getCartCount() > 0 && (
                  <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
