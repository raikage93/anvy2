import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-6">LUMIÈRE</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting premium eyewear for the modern visionary. 
              Quality materials, timeless design, and unparalleled comfort.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-lg font-medium mb-6">Shop</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/shop" className="hover:text-secondary transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=sunglasses" className="hover:text-secondary transition-colors">Sunglasses</Link></li>
              <li><Link to="/shop?category=eyeglasses" className="hover:text-secondary transition-colors">Eyeglasses</Link></li>
              <li><Link to="/shop?category=new-arrivals" className="hover:text-secondary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-medium mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-secondary transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/care" className="hover:text-secondary transition-colors">Care Guide</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-medium mb-6">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500"
              />
              <button className="bg-secondary text-white px-4 py-3 font-medium hover:bg-white hover:text-primary transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2024 Lumière Eyewear. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Twitter size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
