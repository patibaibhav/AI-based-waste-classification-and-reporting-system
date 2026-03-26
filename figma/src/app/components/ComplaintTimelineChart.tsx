import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Complaint } from '../context/DataContext';
import { format, subDays, startOfDay } from 'date-fns';

interface ComplaintTimelineChartProps {
  complaints: Complaint[];
}

export function ComplaintTimelineChart({ complaints }: ComplaintTimelineChartProps) {
  // Get last 14 days
  const days = 14;
  const today = startOfDay(new Date());
  const dateRange = Array.from({ length: days }, (_, i) => subDays(today, days - 1 - i));

  // Aggregate complaints by day
  const timelineData = dateRange.map((date) => {
    const dayStart = startOfDay(date);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const dayComplaints = complaints.filter(
      (c) => c.timestamp >= dayStart && c.timestamp <= dayEnd
    );

    return {
      date: format(date, 'MMM d'),
      pending: dayComplaints.filter((c) => c.status === 'pending').length,
      resolved: dayComplaints.filter((c) => c.status === 'resolved').length,
      total: dayComplaints.length,
    };
  });

  if (complaints.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '12px',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ fill: '#f59e0b', r: 4 }}
            name="Pending"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
            name="Resolved"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#3b82f6', r: 3 }}
            name="Total"
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
