import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, Users, Loader2 } from 'lucide-react';
import api from '../../api';
import type { Order } from '../../types';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalProducts: 0, lowStockItems: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/orders')
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Customers', value: stats.totalUsers.toString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Low Stock Items', value: stats.lowStockItems.toString(), icon: Package, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight uppercase">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(stat => (
          <div key={stat.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-primary-600 transition-all duration-300">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.title}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Products</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map(order => {
                if (!order) return null;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">#{(order.id || '').slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{order.customer?.firstName} {order.customer?.lastName}</span>
                        <span className="text-xs text-gray-400">{order.customer?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2 overflow-hidden">
                        {(order.items || []).slice(0, 3).map((item, i) => (
                          <img
                            key={i}
                            src={item.product?.images?.[0]}
                            alt={item.product?.name}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-gray-50"
                          />
                        ))}
                        {order.items?.length > 3 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-[10px] font-black text-gray-400">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-primary-600">${order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        order.status === 'processing' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                        'bg-gray-50 text-gray-500 border border-gray-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}