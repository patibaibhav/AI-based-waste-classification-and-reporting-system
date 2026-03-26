import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Complaint } from '../context/DataContext';

interface ComplaintCategoryChartProps {
  complaints: Complaint[];
}

export function ComplaintCategoryChart({ complaints }: ComplaintCategoryChartProps) {
  // Aggregate data by category
  const categoryData = complaints.reduce((acc, complaint) => {
    const category = complaint.category;
    if (!acc[category]) {
      acc[category] = { pending: 0, resolved: 0 };
    }
    if (complaint.status === 'pending') {
      acc[category].pending += 1;
    } else {
      acc[category].resolved += 1;
    }
    return acc;
  }, {} as Record<string, { pending: number; resolved: number }>);

  const chartData = Object.entries(categoryData).map(([category, counts]) => ({
    category,
    pending: counts.pending,
    resolved: counts.resolved,
    total: counts.pending + counts.resolved,
  }));

  // Sort by total descending
  chartData.sort((a, b) => b.total - a.total);

  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '12px',
            }}
            cursor={{ fill: '#f3f4f6' }}
          />
          <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" radius={[0, 0, 0, 0]} />
          <Bar dataKey="resolved" stackId="a" fill="#10b981" name="Resolved" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <p className="text-sm text-gray-700">Pending</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <p className="text-sm text-gray-700">Resolved</p>
        </div>
      </div>
    </div>
  );
}
