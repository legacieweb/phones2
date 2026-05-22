import { Outlet, Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X, Smartphone, User, LayoutDashboard, LogOut, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore, useAdminStore, useUserStore } from '../store';
import toast from 'react-hot-toast';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore(state => state.getItemCount());
  const { isAuthenticated: isAdmin } = useAdminStore();
  const { user, isAuthenticated: isUser, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/catalog', label: 'Store' },
    { to: '/community', label: 'Community' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary-100 selection:text-primary-700">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-primary-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">
                  PHO<span className="text-primary-600">NE</span>STORE
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `
                      px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                      ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                to="/cart" 
                className="relative p-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors group"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute top-2 right-2 bg-primary-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                    {itemCount}
                  </span>
                )}
              </Link>

              {isUser ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
                  >
                    <User className="h-4 w-4" />
                    Hi, {user?.firstName}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-3 text-gray-400 hover:text-red-600 rounded-xl transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link 
                    to="/login" 
                    className="px-5 py-2.5 text-gray-600 hover:text-gray-900 text-sm font-bold transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-all shadow-md hover:shadow-primary-600/20 active:scale-95"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-600 rounded-xl text-sm font-bold hover:bg-primary-100 transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </Link>
              )}

              <button
                className="md:hidden p-3 text-gray-700 hover:bg-gray-100 rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? 'max-h-[500px] opacity-100 mt-4 pb-4' : 'max-h-0 opacity-0'}
          `}>
            <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-2xl">
              {navItems.map((item) => (
                <NavLink 
                  key={item.to}
                  to={item.to} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    px-4 py-3 rounded-xl text-base font-bold transition-all
                    ${isActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  {item.label}
                </NavLink>
              ))}
              
              <div className="h-px bg-gray-200 my-2 mx-4" />

              {isUser ? (
                <>
                  <NavLink 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:bg-gray-200"
                  >
                    <User className="h-5 w-5" />
                    My Account ({user?.firstName})
                  </NavLink>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:bg-gray-200"
                  >
                    <User className="h-5 w-5" />
                    Login
                  </NavLink>
                  <NavLink 
                    to="/signup" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-primary-600 hover:bg-primary-50"
                  >
                    <UserPlus className="h-5 w-5" />
                    Create Account
                  </NavLink>
                </>
              )}

              {isAdmin && (
                <NavLink 
                  to="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-primary-700 bg-primary-100 hover:bg-primary-200"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Admin Dashboard
                </NavLink>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-950 text-white">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-5">
                <div className="bg-primary-600 p-2.5 rounded-xl">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight">
                  PHO<span className="text-primary-500">NE</span>STORE
                </span>
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                Your premium mobile phone destination. Discover the latest smartphones, tablets, and accessories at unbeatable prices.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', label: 'Facebook', bg: 'bg-[#1877F2]' },
                  { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', label: 'Instagram', bg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045]' },
                  { icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', label: 'Twitter', bg: 'bg-[#1DA1F2]' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className={`w-10 h-10 ${social.bg} rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-200`}
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-5">Shop</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Home</Link></li>
                <li><Link to="/catalog" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">All Products</Link></li>
                <li><Link to="/catalog?category=smartphones" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Smartphones</Link></li>
                <li><Link to="/catalog?category=tablets" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Tablets</Link></li>
                <li><Link to="/catalog?category=accessories" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Accessories</Link></li>
                <li><Link to="/community" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Community</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-5">Support</h4>
              <ul className="space-y-3">
                <li><Link to="/shipping" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Shipping Policy</Link></li>
                <li><Link to="/returns" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Returns &amp; Refunds</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-5">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <svg className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@phonestore.com
                </li>
                <li className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <svg className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <svg className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  123 Tech Street, CA 90210
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">&copy; 2026 PhoneStore. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping</Link>
              <Link to="/returns" className="text-gray-400 hover:text-white transition-colors">Returns</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}