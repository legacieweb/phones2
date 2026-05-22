import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const featuredProducts = mockProducts.filter(p => p.featured);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-12 lg:pt-32 lg:pb-24">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-primary-50 rounded-l-[100px] -z-10 translate-x-20 skew-x-[-10deg]" />
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary-100 rounded-full blur-[100px] opacity-60 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-black mb-8 animate-bounce shadow-sm border border-primary-100">
                <Sparkles className="h-4 w-4" />
                <span>New Arrival: iPhone 15 Pro Max</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                UPGRADE TO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">PREMIUM</span> <br />
                EXPERIENCE.
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                The ultimate collection of high-end smartphones and professional gear. 
                Experience technology like never before with our curated selection.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/catalog"
                  className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-primary-600 transition-all shadow-xl shadow-gray-900/20 active:scale-95 flex items-center gap-3"
                >
                  Explore Store
                  <ArrowRight className="h-6 w-6" />
                </Link>
                <Link
                  to="/catalog?category=smartphones"
                  className="px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-lg hover:border-primary-600 hover:text-primary-600 transition-all active:scale-95"
                >
                  Top Brands
                </Link>
              </div>

              <div className="mt-16 flex items-center gap-8 border-t border-gray-100 pt-8">
                <div>
                  <div className="text-3xl font-black text-gray-900">10k+</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Users</div>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div>
                  <div className="text-3xl font-black text-gray-900">500+</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Models</div>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div>
                  <div className="text-3xl font-black text-gray-900">24h</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Delivery</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10 animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800" 
                  alt="Premium Phone" 
                  className="rounded-[60px] shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-700"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-600/10 rounded-full blur-[100px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-y border-gray-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-3xl hover:bg-gray-50 transition-colors group">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-black text-gray-900">Official Warranty</h3>
                <p className="text-sm font-medium text-gray-500">12 Months Full Support</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-3xl hover:bg-gray-50 transition-colors group border-x border-gray-50">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Truck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-black text-gray-900">Fast Shipping</h3>
                <p className="text-sm font-medium text-gray-500">Express 24h Delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-3xl hover:bg-gray-50 transition-colors group">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-black text-gray-900">Best Price</h3>
                <p className="text-sm font-medium text-gray-500">Price Match Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-primary-600 font-black text-sm uppercase tracking-[0.2em] mb-4">Trending Now</div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">FEATURED MODELS.</h2>
            </div>
            <Link 
              to="/catalog" 
              className="group flex items-center gap-2 text-lg font-black text-gray-900 hover:text-primary-600 transition-colors"
            >
              See All Products
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">PREMIUM BRANDS.</h2>
            <p className="text-gray-500 font-medium text-lg">We only stock the best. Experience quality from the world's leading technology manufacturers.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Apple', 'Samsung', 'Google', 'OnePlus'].map((brand) => (
              <Link 
                key={brand}
                to={`/catalog?brand=${brand}`}
                className="bg-white p-10 rounded-[40px] border border-gray-100 flex items-center justify-center grayscale hover:grayscale-0 hover:border-primary-600 hover:shadow-2xl hover:shadow-primary-600/10 transition-all duration-500 group"
              >
                <span className="text-3xl font-black text-gray-300 group-hover:text-gray-900 transition-colors">{brand}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gray-900 rounded-[60px] p-12 md:p-24 shadow-2xl shadow-gray-900/20">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600 skew-x-[-15deg] translate-x-20 opacity-10" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-600 text-white text-xs font-black mb-8 uppercase tracking-widest border border-white/10">
                  <Sparkles className="h-3 w-3" />
                  <span>Limited Time Offer</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
                  GET <span className="text-primary-500">20% OFF</span> <br /> 
                  YOUR FIRST <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary-400">ORDER.</span>
                </h2>
                <p className="text-gray-400 text-xl mb-12 font-medium leading-relaxed max-w-lg">
                  Join our exclusive community of 10,000+ tech enthusiasts and unlock premium rewards, early access, and expert technical insights.
                </p>
                <Link
                  to="/community"
                  className="inline-flex items-center gap-4 px-12 py-6 bg-white text-gray-900 rounded-[24px] font-black text-xl hover:bg-primary-600 hover:text-white transition-all shadow-2xl active:scale-95 group"
                >
                  Join the Inner Circle
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-primary-600/20 blur-[120px] rounded-full" />
                <img 
                  src="https://images.unsplash.com/photo-1592890288564-76628a30a657?w=800" 
                  alt="Special Offer" 
                  className="relative z-10 rounded-[60px] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 border-8 border-white/5"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-[32px] shadow-2xl animate-bounce">
                  <div className="text-primary-600 font-black text-4xl leading-none">20%</div>
                  <div className="text-gray-900 font-bold text-xs uppercase tracking-widest mt-1">Discount</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">STAY IN THE LOOP.</h2>
            <p className="text-gray-500 font-medium mb-10 text-lg">Get notified about new releases, exclusive flash sales, and technical insights.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-600 transition-all font-medium text-lg"
                required
              />
              <button
                type="submit"
                className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-primary-600 transition-all shadow-xl active:scale-95"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-6 text-sm text-gray-400 font-bold uppercase tracking-widest">NO SPAM, WE PROMISE.</p>
          </div>
        </div>
      </section>
    </div>
  );
}