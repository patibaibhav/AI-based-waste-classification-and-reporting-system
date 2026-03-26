import React from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { StatsCard } from '../components/StatsCard';
import { Button } from '../components/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, Clock, CheckCircle, TrendingUp, List, User } from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { complaints, getComplaintStats } = useData();
  const stats = getComplaintStats();
  const isDark = document.documentElement.classList.contains('dark');

  // Prepare data for charts
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const barChartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    complaints: value,
  }));

  const pieChartData = [
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
    { name: 'Resolved', value: stats.resolved, color: '#10B981' },
  ];

  return (
    <div className="px-4 py-6 pt-16 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">System Management</p>
          </div>
          <button
            onClick={() => navigate('/admin/profile')}
            className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <User size={24} className="text-gray-900 dark:text-gray-100" />
          </button>
        </div>
        <Button
          icon={List}
          variant="primary"
          size="medium"
          fullWidth
          onClick={() => navigate('/admin/complaints')}
        >
          Manage Complaints
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatsCard
          title="Total"
          value={stats.total}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Top Issue"
          value={stats.topCategory}
          icon={TrendingUp}
          color="gray"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Complaints by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={isDark ? 0.3 : 1} />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke={isDark ? "#9CA3AF" : "#4B5563"} tick={{fontSize: 12}} />
              <YAxis stroke={isDark ? "#9CA3AF" : "#4B5563"} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="complaints" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: 'none', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', color: isDark ? '#D1D5DB' : '#374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => navigate('/admin/complaints')}
            className="bg-white dark:bg-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 text-left font-medium transition-colors w-full"
          >
            View All Complaints →
          </button>
          <button
            onClick={() => navigate('/admin/complaints')}
            className="bg-white dark:bg-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 text-left font-medium transition-colors w-full"
          >
            View Pending Issues →
          </button>
        </div>
      </div>
    </div>
  );
}