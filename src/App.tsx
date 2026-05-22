import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAdminStore, useUserStore } from './store';

import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomerDashboard from './pages/CustomerDashboard';
import CommunityPage from './pages/CommunityPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AdminLoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import UsersPage from './pages/admin/UsersPage';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated: isAdmin } = useAdminStore();
  const { isAuthenticated: isUser } = useUserStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check if both stores have hydrated
    const checkHydration = () => {
      // @ts-ignore
      const userHydrated = useUserStore.persist.hasHydrated();
      // @ts-ignore
      const adminHydrated = useAdminStore.persist.hasHydrated();
      
      if (userHydrated && adminHydrated) {
        setIsHydrated(true);
      } else {
        // If not hydrated yet, listen for hydration
        // @ts-ignore
        const unsubUser = useUserStore.persist.onHydrate(() => setIsHydrated(useUserStore.persist.hasHydrated() && useAdminStore.persist.hasHydrated()));
        // @ts-ignore
        const unsubAdmin = useAdminStore.persist.onHydrate(() => setIsHydrated(useUserStore.persist.hasHydrated() && useAdminStore.persist.hasHydrated()));
        
        // Also check periodically as a fallback
        const interval = setInterval(() => {
          // @ts-ignore
          if (useUserStore.persist.hasHydrated() && useAdminStore.persist.hasHydrated()) {
            setIsHydrated(true);
            clearInterval(interval);
          }
        }, 50);

        return () => {
          unsubUser();
          unsubAdmin();
          clearInterval(interval);
        };
      }
    };
    
    return checkHydration();
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="shipping" element={<ShippingPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="dashboard" element={isUser ? <CustomerDashboard /> : <Navigate to="/login" />} />
          </Route>
          
          <Route path="/login" element={!isUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!isUser ? <SignupPage /> : <Navigate to="/dashboard" />} />
          
          <Route path="/admin/login" element={!isAdmin ? <AdminLoginPage /> : <Navigate to="/admin" />} />
          <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;