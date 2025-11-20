import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { products } from '../data/products';

const Home = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
            alt="Woman wearing stylish glasses" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight animate-fade-in-up">
            See the World <br /> in a New Light
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light opacity-90 animate-fade-in-up delay-100">
            Handcrafted eyewear designed for the modern visionary. 
            Experience clarity, comfort, and uncompromising style.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-secondary hover:text-white transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-200"
          >
            <span>Shop Collection</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-primary">Featured Collection</h2>
              <p className="text-gray-500">Curated favorites for this season.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center space-x-2 text-primary font-medium hover:text-secondary transition-colors">
              <span>View All</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="relative overflow-hidden mb-6 bg-gray-100 aspect-[4/5]">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <button className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 bg-white text-primary px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-300 hover:bg-secondary hover:text-white whitespace-nowrap">
                    View Details
                  </button>
                </div>
                <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-secondary transition-colors">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{product.category}</span>
                  <span className="font-medium">${product.price}</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center space-x-2 text-primary font-medium hover:text-secondary transition-colors">
              <span>View All</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-secondary">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <p className="text-gray-500 leading-relaxed">
                Hand-polished acetate and medical-grade titanium for durability and comfort.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-secondary">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Free Worldwide Shipping</h3>
              <p className="text-gray-500 leading-relaxed">
                Complimentary shipping on all orders over $200, delivered to your doorstep.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-secondary">
                <RefreshCw size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">30-Day Returns</h3>
              <p className="text-gray-500 leading-relaxed">
                Try them at home. If they're not perfect, return them within 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
