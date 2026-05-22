import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Loader2, CheckCircle, Package, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useCartStore, useUserStore } from '../store';

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: unknown) => {
        openIframe: () => void;
      };
    };
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useUserStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handlePaystackPayment = async () => {
    if (items.length === 0) return;

    try {
      const response = await axios.post('http://localhost:5000/api/paystack/initialize', {
        email: customerInfo.email,
        amount: getTotal(),
        metadata: {
          customerInfo,
          items
        }
      });

      const { data } = response.data;

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_232531a5c927ef2cc67ed1b85af3f26e3b8ed2f2',
        email: customerInfo.email,
        amount: getTotal() * 100,
        currency: 'USD',
        ref: data.reference,
        onClose: () => {
          console.log('Payment cancelled');
        },
        callback: (response: { reference: string }) => {
          setIsProcessing(true);
          axios.post('http://localhost:5000/api/orders', {
            reference: response.reference,
            orderData: {
              customer: customerInfo,
              items,
              total: getTotal()
            }
          }).then(() => {
            clearCart();
            setIsProcessing(false);
            setShowSuccess(true);
          }).catch((error) => {
            setIsProcessing(false);
            console.error('Failed to save order:', error);
            alert('Payment successful but failed to save order. Please contact support.');
          });
        }
      });
      handler.openIframe();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Failed to initialize payment. Is the server running?');
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-primary-600 p-8 flex justify-center">
            <div className="bg-white/20 rounded-full p-4 animate-bounce">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase, {customerInfo.firstName}! Your order is being processed and will be shipped soon.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Track your order</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
              
              <button
                onClick={() => navigate('/dashboard', { state: { email: customerInfo.email } })}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center justify-center"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {isProcessing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Securing your order...</h2>
          <p className="text-gray-500">Please don't close this page</p>
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={customerInfo.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={customerInfo.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={customerInfo.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={customerInfo.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={customerInfo.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brand} x {quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    ${product.price * quantity}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getTotal()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePaystackPayment}
            className="w-full flex items-center justify-center bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Pay with Paystack
          </button>
        </div>
      </div>
    </div>
  );
}