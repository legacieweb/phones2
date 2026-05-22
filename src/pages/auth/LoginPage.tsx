import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, User, Eye, EyeOff } from 'lucide-react';
import { useUserStore, useAdminStore } from '../../store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useUserStore(state => state.login);
  const adminLogin = useAdminStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Try admin login first if it matches admin email pattern
    if (credentials.email === 'admin@phones.com') {
      const adminSuccess = await adminLogin(credentials.email, credentials.password);
      if (adminSuccess) {
        setLoading(false);
        toast.success('Welcome back, Admin!');
        navigate('/admin');
        return;
      }
    }

    const success = await login(credentials.email, credentials.password);
    setLoading(false);
    
    if (success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200"
          alt="Login Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-600/20 backdrop-blur-[2px]" />
        <div className="absolute bottom-20 left-20 right-20 text-white z-10">
          <h2 className="text-5xl font-black mb-6 tracking-tighter leading-tight">
            YOUR WORLD <br /> IN YOUR HANDS.
          </h2>
          <p className="text-xl font-medium opacity-90">
            Sign in to access your orders, saved items, <br />
            and personalized recommendations.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-[450px]">
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary-50 text-primary-600 mb-6 group hover:rotate-12 transition-transform duration-300">
                <User className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Login</h1>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Welcome Back</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-600 transition-all font-medium placeholder:text-gray-300"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-600 transition-all font-medium placeholder:text-gray-300"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-primary-600 disabled:bg-gray-400 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-gray-900/10 active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-500 font-medium">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-600 font-black hover:underline underline-offset-4">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/" className="text-sm font-black text-gray-400 hover:text-primary-600 transition-colors uppercase tracking-widest">
              ← Return to storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
