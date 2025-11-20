import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">Shopping Cart</h1>
          <p className="text-gray-500 mb-8">Your cart is empty</p>
          <Link to="/shop" className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary transition-colors">
            <span>Continue Shopping</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 pb-8 border-b border-gray-100">
                  <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-serif font-bold">{item.name}</h3>
                      <span className="font-medium">${item.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{item.category}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-gray-200 rounded-full px-3 py-1">
                        <button 
                          className="px-2 text-gray-500 hover:text-black"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="mx-2 text-sm font-medium">{item.quantity}</span>
                        <button 
                          className="px-2 text-gray-500 hover:text-black"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-full font-medium hover:bg-secondary transition-colors flex items-center justify-center space-x-2 mb-4">
                <span>Checkout</span>
                <ArrowRight size={18} />
              </button>
              <div className="flex justify-center space-x-2 text-gray-400">
                <CreditCard size={20} />
                <span className="text-sm">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
