import React from 'react';
import { Filter, Calendar, Tag, CheckCircle } from 'lucide-react';

interface ComplaintFiltersProps {
  filters: {
    timeRange: 'all' | '7days' | '30days';
    category: string;
    status: 'all' | 'pending' | 'resolved';
  };
  onFilterChange: (key: string, value: string) => void;
}

export function ComplaintFilters({ filters, onFilterChange }: ComplaintFiltersProps) {
  const categories = [
    'all',
    'Illegal Dumping',
    'Overflowing Bin',
    'Littering',
    'Broken Infrastructure',
    'Other',
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-700 dark:text-gray-400" />
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Filters</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Time Range Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar size={16} />
            Time Range
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => onFilterChange('timeRange', e.target.value)}
            className="w-full px-4 py-3 text-base rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Tag size={16} />
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-4 py-3 text-base rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <CheckCircle size={16} />
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-4 py-3 text-base rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
}
