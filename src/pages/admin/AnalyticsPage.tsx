import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import api from '../../api';

interface CategoryData {
  name: string;
  value: number;
}

interface MonthlyRevenue {
  name: string;
  revenue: number;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  monthlyRevenue: MonthlyRevenue[];
  categoryDistribution: CategoryData[];
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({ 
    totalOrders: 0, 
    totalRevenue: 0, 
    totalUsers: 0,
    monthlyRevenue: [],
    categoryDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const avgOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

  const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#7dd3fc', '#bae6fd'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter uppercase">Market Intelligence</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-4xl font-black text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
          <p className="text-4xl font-black text-gray-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Order Value</p>
          <p className="text-4xl font-black text-gray-900">${avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Revenue Momentum</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={stats.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
              />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                itemStyle={{fontWeight: 800, textTransform: 'uppercase', fontSize: '10px'}}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0ea5e9" 
                strokeWidth={4} 
                dot={{r: 6, fill: '#0ea5e9', strokeWidth: 3, stroke: '#fff'}}
                activeDot={{r: 8, strokeWidth: 0}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Inventory Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution || []}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {(stats.categoryDistribution || []).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {(stats.categoryDistribution || []).map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                <span className="text-[10px] font-black text-gray-500 uppercase">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}