import { useEffect, useMemo, useState } from 'react';
import type { ElementType } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ShoppingBag, Package, CreditCard, User, Clock, Settings, Heart, LogOut, LayoutDashboard, Users, Banknote, Trash2 } from 'lucide-react';
import { useUserStore, useWishlistStore, useCartStore } from '../store';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Order } from '../types';

type Section = 'overview' | 'orders' | 'profile' | 'wishlist' | 'settings' | 'community' | 'payments';

interface SidebarItemProps {
  icon: ElementType;
  label: string;
  id: Section;
  activeId: string;
  onClick: (id: Section) => void;
}

const SidebarItem = ({ icon: Icon, label, id, activeId, onClick }: SidebarItemProps) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all duration-300 ${
      activeId === id 
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
}

const Overview = ({ stats, navigate, user }: { stats: DashboardStats, navigate: (path: string) => void, user: any }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:border-primary-600 transition-all duration-300">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
          <Package className="h-6 w-6" />
        </div>
        <div className="text-4xl font-black text-gray-900 mb-1">{stats.totalOrders}</div>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Orders</div>
      </div>
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:border-primary-600 transition-all duration-300">
        <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
          <CreditCard className="h-6 w-6" />
        </div>
        <div className="text-4xl font-black text-gray-900 mb-1">${stats.totalSpent}</div>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Spent</div>
      </div>
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:border-primary-600 transition-all duration-300">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
          <Clock className="h-6 w-6" />
        </div>
        <div className="text-4xl font-black text-gray-900 mb-1">{stats.activeOrders}</div>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active</div>
      </div>
    </div>

    {!user?.isPremium && (
      <div className="bg-gray-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600 skew-x-[-15deg] translate-x-20 opacity-10" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-4 uppercase">Premium Membership</h2>
          <p className="text-gray-400 max-w-lg mb-8 font-medium">Join our community to unlock exclusive deals, 24/7 tech support, and early access to new releases.</p>
          <button 
            onClick={() => navigate('/community')}
            className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-sm hover:bg-primary-600 hover:text-white transition-all active:scale-95"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    )}
  </div>
);

const WishlistSection = ({ navigate }: { navigate: (path: string) => void }) => {
  const { items, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {items.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
          <Heart className="h-16 w-16 text-gray-200 mx-auto mb-6" />
          <h3 className="text-xl font-black text-gray-900 mb-2 uppercase">Your Wishlist is Empty</h3>
          <p className="text-gray-400 mb-8 font-medium">Save items you love to find them later.</p>
          <button onClick={() => navigate('/catalog')} className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 transition-all active:scale-95">
            Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex gap-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
              <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-gray-900 uppercase text-sm mb-1">{product.name}</h4>
                  <p className="text-primary-600 font-black text-sm">${product.price}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      addItem(product);
                      toast.success('Added to cart');
                    }}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-primary-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => toggleItem(product)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileSection = ({ user }: { user: any }) => (
  <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row gap-12 items-start">
      <div className="w-32 h-32 rounded-[40px] bg-primary-50 flex items-center justify-center text-primary-600">
        <User className="h-16 w-16" />
      </div>
      <div className="flex-1 space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">First Name</label>
            <div className="p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 border border-gray-100">{user?.firstName}</div>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Last Name</label>
            <div className="p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 border border-gray-100">{user?.lastName}</div>
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
            <div className="p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 border border-gray-100">{user?.email}</div>
          </div>
        </div>
        <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-primary-600 transition-all active:scale-95 uppercase">
          Update Profile
        </button>
      </div>
    </div>
  </div>
);

const SettingsSection = () => (
  <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm animate-in fade-in duration-500">
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
        <div>
          <h4 className="font-black text-gray-900 uppercase text-sm mb-1">Email Notifications</h4>
          <p className="text-xs font-medium text-gray-400">Receive updates about your orders and special offers.</p>
        </div>
        <div className="w-12 h-6 bg-primary-600 rounded-full relative">
          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 opacity-50">
        <div>
          <h4 className="font-black text-gray-900 uppercase text-sm mb-1">Two-Factor Authentication</h4>
          <p className="text-xs font-medium text-gray-400">Add an extra layer of security to your account.</p>
        </div>
        <div className="w-12 h-6 bg-gray-200 rounded-full relative">
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
        </div>
      </div>
      <div className="p-6">
        <h4 className="font-black text-red-600 uppercase text-sm mb-4">Danger Zone</h4>
        <button className="px-8 py-4 border-2 border-red-100 text-red-500 rounded-2xl font-black text-sm hover:bg-red-50 transition-all uppercase">
          Delete Account
        </button>
      </div>
    </div>
  </div>
);

const CommunitySection = ({ currentUser }: { currentUser: any }) => {
  const { updateUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleJoinPremium = async () => {
    if (!currentUser?.email) {
      toast.error('User email not found');
      return;
    }
    setLoading(true);

    try {
      const response = await api.post('/api/paystack/initialize', {
        email: currentUser.email,
        amount: 50, // Premium membership fee $50
        metadata: {
          type: 'premium_membership',
          userId: currentUser.id
        }
      });

      const { data } = response.data;

      const handler = (window as any).PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_232531a5c927ef2cc67ed1b85af3f26e3b8ed2f2',
        email: currentUser.email,
        amount: 50 * 100,
        currency: 'USD',
        ref: data.reference,
        callback: () => {
          api.post(`/api/users/${currentUser.email}/premium`, {
            isPremium: true
          }).then(() => {
            toast.success('Welcome to the Premium Circle!');
            updateUser({ isPremium: true });
          }).catch((error) => {
            console.error('Failed to update premium status:', error);
            toast.error('Payment successful but failed to update status. Please contact support.');
          });
        },
        onClose: () => {
          toast.error('Payment cancelled');
        }
      });
      handler.openIframe();
    } catch (error: any) {
      console.error('Failed to initialize premium payment:', error);
      const errorMsg = error.response?.data?.error || 'Failed to initialize payment';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl shadow-primary-600/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
            <Users className="h-3 w-3" />
            {currentUser?.isPremium ? 'Premium Community Member' : 'Community Access'}
          </div>
          <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter leading-none">
            {currentUser?.isPremium ? 'Welcome to the inner circle.' : 'Unlock the full experience.'}
          </h2>
          <p className="text-primary-100 text-lg font-medium mb-8 leading-relaxed">
            {currentUser?.isPremium 
              ? 'Connect with fellow tech enthusiasts, share your setups, and get direct access to our product team.'
              : 'Join our premium community to get exclusive access to events, early product releases, and expert tech support.'}
          </p>
          <div className="flex flex-wrap gap-4">
            {currentUser?.isPremium ? (
              <>
                <button className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-black text-sm hover:shadow-xl transition-all active:scale-95 uppercase">
                  Join Discussion
                </button>
                <button className="px-8 py-4 bg-primary-500/20 text-white border border-white/10 rounded-2xl font-black text-sm hover:bg-white/10 transition-all active:scale-95 uppercase backdrop-blur-sm">
                  Community Guidelines
                </button>
              </>
            ) : (
              <button 
                onClick={handleJoinPremium}
                disabled={loading}
                className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-black text-sm hover:shadow-xl transition-all active:scale-95 uppercase flex items-center gap-2"
              >
                {loading ? 'Processing...' : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Upgrade to Premium — $50
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-black text-gray-900 uppercase mb-4">Latest Trends</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 uppercase text-xs">How to optimize your new device</h4>
                  <p className="text-[10px] font-medium text-gray-400">2.4k views • 152 comments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-black text-gray-900 uppercase mb-4">Upcoming Events</h3>
          <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
            <div className="text-primary-600 font-black text-lg mb-2 uppercase">Tech Talk 2024</div>
            <p className="text-sm font-medium text-gray-600 mb-6 uppercase tracking-widest">Live Q&A with our engineering team</p>
            <button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-primary-700 transition-colors">
              {currentUser?.isPremium ? 'Register for Free' : 'Join Premium to Access'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentsSection = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
          <Banknote className="h-6 w-6" />
        </div>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Balance</div>
        <div className="text-4xl font-black text-gray-900">$0.00</div>
      </div>
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm md:col-span-2">
        <h3 className="text-xl font-black text-gray-900 uppercase mb-6">Linked Accounts</h3>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
          <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <div className="font-black text-gray-900 uppercase text-xs">No cards linked</div>
            <button className="text-primary-600 font-black uppercase text-[10px] hover:underline">Add Payment Method</button>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm">
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-sm font-black text-gray-900 uppercase">Recent Transactions</h3>
        <button className="text-[10px] font-black text-primary-600 uppercase hover:underline">Download Statement</button>
      </div>
      <div className="p-8 text-center py-20">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <Clock className="h-8 w-8 text-gray-300" />
        </div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No recent transactions found</p>
      </div>
    </div>
  </div>
);

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUserStore();
  const [activeSection, setActiveSection] = useState<Section>('overview');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as Section;
    if (['overview', 'orders', 'profile', 'wishlist', 'settings', 'community', 'payments'].includes(hash)) {
      setActiveSection(hash);
    }
  }, []);

  const { data: orders = [], isLoading: loading } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: async () => {
      const response = await api.get(`/api/orders/${user?.email}`);
      return response.data as Order[];
    },
    enabled: !!isAuthenticated && !!user?.email,
  });

  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['user-profile', user?.email],
    queryFn: async () => {
      const response = await api.get(`/api/users/${user?.email?.trim()}`);
      return response.data;
    },
    enabled: !!isAuthenticated && !!user?.email,
  });

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const activeOrders = orders.filter(order => order.status !== 'delivered').length;
    return {
      totalOrders: orders.length,
      totalSpent,
      activeOrders
    };
  }, [orders]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
            <User className="h-6 w-6" />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-black text-gray-900 truncate uppercase leading-tight">{currentUser?.firstName || user?.firstName}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {currentUser?.isPremium ? 'Premium Member' : 'Free Member'}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Overview" id="overview" activeId={activeSection} onClick={setActiveSection} />
          <SidebarItem icon={Package} label="My Orders" id="orders" activeId={activeSection} onClick={setActiveSection} />
          <SidebarItem icon={Heart} label="Wishlist" id="wishlist" activeId={activeSection} onClick={setActiveSection} />
          <SidebarItem icon={Users} label="Community" id="community" activeId={activeSection} onClick={setActiveSection} />
          <SidebarItem icon={Banknote} label="Payments" id="payments" activeId={activeSection} onClick={setActiveSection} />
          <SidebarItem icon={User} label="Profile" id="profile" activeId={activeSection} onClick={setActiveSection} />
          <SidebarItem icon={Settings} label="Settings" id="settings" activeId={activeSection} onClick={setActiveSection} />
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <div className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4">Dashboard</div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                {activeSection}
              </h1>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-green-600 uppercase">
                  {currentUser?.isPremium ? 'Premium Account' : 'Live Account'}
                </span>
              </div>
            </div>
          </header>

          {(loading || userLoading) ? (
            <div className="py-24 text-center">
              <div className="inline-block h-12 w-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {activeSection === 'overview' && <Overview stats={stats} navigate={navigate} user={currentUser} />}
              
              {activeSection === 'orders' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  {orders.length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
                      <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                      <h3 className="text-xl font-black text-gray-900 mb-2 uppercase">No Orders Found</h3>
                      <button onClick={() => navigate('/catalog')} className="text-primary-600 font-black uppercase text-sm hover:underline">Start Shopping</button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                        <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center">
                          <div className="flex items-center gap-8">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-400 uppercase mb-1">Status</span>
                              <span className={`text-xs font-black uppercase tracking-widest ${order.status === 'delivered' ? 'text-green-600' : 'text-blue-600'}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-400 uppercase mb-1">Date</span>
                              <span className="text-xs font-black text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-400 uppercase mb-1">Total</span>
                              <span className="text-xs font-black text-primary-600">${order.total}</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-gray-300">#{order.id}</span>
                        </div>
                        <div className="p-8">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-6 mb-4 last:mb-0">
                              <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-2xl object-cover bg-gray-50 border border-gray-100" />
                              <div className="flex-1">
                                <h4 className="text-sm font-black text-gray-900 uppercase">{item.product.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity}</p>
                              </div>
                              <span className="text-sm font-black text-gray-900">${item.product.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeSection === 'wishlist' && <WishlistSection navigate={navigate} />}
              {activeSection === 'profile' && <ProfileSection user={currentUser} />}
              {activeSection === 'settings' && <SettingsSection />}
              {activeSection === 'community' && <CommunitySection currentUser={currentUser} />}
              {activeSection === 'payments' && <PaymentsSection />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
