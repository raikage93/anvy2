import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Optional: navigate to cart or show a success message
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-secondary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center space-x-2 text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-lg">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                  <img 
                    src={product.image} 
                    alt={`View ${i + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2 text-secondary font-medium uppercase tracking-wider text-sm">{product.category}</div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-2xl font-medium">${product.price}</span>
              <div className="flex items-center text-yellow-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="text-gray-400 text-sm ml-2">(24 reviews)</span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {product.description} Designed for those who appreciate fine craftsmanship and attention to detail. 
              Each pair is meticulously inspected to ensure perfection.
            </p>

            <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Truck size={20} />
                <span>Free shipping on orders over $200</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <ShieldCheck size={20} />
                <span>2-year warranty included</span>
              </div>
            </div>

            <div className="flex space-x-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-full">
                <button 
                  className="px-4 py-3 hover:text-secondary transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button 
                  className="px-4 py-3 hover:text-secondary transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-colors flex items-center justify-center space-x-2 py-4"
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
