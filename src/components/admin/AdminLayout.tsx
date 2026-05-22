import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Users as UsersIcon, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAdminStore } from '../../store';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useAdminStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/users', icon: UsersIcon, label: 'Users' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex items-center h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-primary-600">Admin Panel</h1>
        </div>
        <nav className="mt-6 px-3">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-3 py-2 mb-1 text-gray-700 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 mt-4 text-red-600 rounded-lg hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 lg:pl-64">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 ml-4 lg:ml-0">PhoneStore Admin</h2>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}