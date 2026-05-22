import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Zap, Shield, MessageSquare, Rocket, Check, ArrowRight, Star } from 'lucide-react';
import api from '../api';
import { useUserStore } from '../store';
import toast from 'react-hot-toast';

export default function CommunityPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard#community');
    }
  }, [isAuthenticated, navigate]);

  const plans = [
    {
      id: 'monthly',
      name: 'Tech Enthusiast',
      price: 9.99,
      interval: 'month',
      features: [
        'Exclusive Discord Access',
        'Early access to sales',
        'Member-only badges',
        'Priority support response',
      ],
      icon: Rocket,
      color: 'blue'
    },
    {
      id: 'yearly',
      name: 'Elite Innovator',
      price: 99.00,
      interval: 'year',
      features: [
        'All Enthusiast features',
        '2 months free (Save 17%)',
        'Beta testing new products',
        'Quarterly tech gift box',
        'Direct chat with experts',
      ],
      icon: Star,
      color: 'primary',
      popular: true
    }
  ];

  const handleSubscription = async (planId: string, amount: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return;
    }

    setLoading(planId);
    try {
      const response = await axios.post('http://localhost:5000/api/paystack/initialize', {
        email: user?.email,
        amount: amount,
        metadata: {
          planId,
          userId: user?.id,
          type: 'subscription'
        }
      });

      const { data } = response.data;
      
      const handler = (window as any).PaystackPop.setup({ // eslint-disable-line @typescript-eslint/no-explicit-any
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_demo_key',
        email: user?.email,
        amount: amount * 100,
        ref: data.reference,
        callback: async () => {
          try {
            await axios.post(`http://localhost:5000/api/users/${user?.email}/premium`, {
              isPremium: true
            });
            toast.success('Welcome to the inner circle! Subscription confirmed.');
            useUserStore.getState().updateUser({ isPremium: true });
            navigate('/dashboard#community');
          } catch (error) {
            console.error('Failed to update premium status:', error);
            toast.error('Subscription successful but failed to update status locally.');
            navigate('/dashboard#community');
          }
        },
        onClose: () => setLoading(null)
      });
      handler.openIframe();
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error('Failed to initialize subscription');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gray-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600 skew-x-[-15deg] translate-x-32 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-primary-400 text-xs font-black uppercase tracking-widest mb-8 border border-white/10">
            <Users className="h-4 w-4" />
            <span>Join 15,000+ Members</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
            THE INNER <span className="text-primary-500">CIRCLE.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed mb-12">
            Elevate your technology experience. Get exclusive access to the world's most innovative mobile community, expert insights, and premium rewards.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="w-16 h-16 rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase">Expert Network</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Direct access to tech specialists and hardware engineers for personalized advice.</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 rounded-[24px] bg-primary-50 text-primary-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase">Instant Perks</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Automatic entry into monthly giveaways and guaranteed best pricing on all new launches.</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 rounded-[24px] bg-orange-50 text-orange-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase">Elite Support</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Priority queue jumping for all technical support and warranty claims.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase">Choose Your Tier</h2>
            <p className="text-gray-500 font-medium text-lg">Invest in a superior mobile lifestyle. No hidden fees, cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative bg-white p-10 rounded-[48px] shadow-sm border-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
                  plan.popular ? 'border-primary-600 shadow-primary-600/10' : 'border-transparent'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Most Innovative
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                  plan.color === 'primary' ? 'bg-primary-50 text-primary-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  <plan.icon className="h-7 w-7" />
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                  <span className="text-gray-400 font-bold uppercase text-xs">/ {plan.interval}</span>
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  disabled={loading !== null}
                  onClick={() => handleSubscription(plan.id, plan.price)}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                    plan.popular 
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-600/20' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-900/10'
                  }`}
                >
                  {loading === plan.id ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Get Started</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
