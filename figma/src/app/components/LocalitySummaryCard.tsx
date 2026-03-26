import React from 'react';
import { LocalityStats } from '../context/DataContext';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, Minus, Tag } from 'lucide-react';

interface LocalitySummaryCardProps {
  stats: LocalityStats;
}

export function LocalitySummaryCard({ stats }: LocalitySummaryCardProps) {
  const getTrendIcon = () => {
    if (stats.trend === 'increasing') {
      return <TrendingUp size={20} className="text-red-500" />;
    } else if (stats.trend === 'decreasing') {
      return <TrendingDown size={20} className="text-green-500" />;
    } else {
      return <Minus size={20} className="text-gray-500" />;
    }
  };

  const getTrendText = () => {
    if (stats.trend === 'increasing') {
      return 'Increasing';
    } else if (stats.trend === 'decreasing') {
      return 'Decreasing';
    } else {
      return 'Stable';
    }
  };

  const getTrendColor = () => {
    if (stats.trend === 'increasing') {
      return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
    } else if (stats.trend === 'decreasing') {
      return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
    } else {
      return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{stats.locality} - Summary</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Total Complaints */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} className="text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total</p>
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
        </div>

        {/* Pending Complaints */}
        <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} className="text-orange-600 dark:text-orange-400" />
            <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Pending</p>
          </div>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.pending}</p>
        </div>

        {/* Resolved Complaints */}
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">Resolved</p>
          </div>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.resolved}</p>
        </div>

        {/* Most Common Category */}
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={20} className="text-purple-600 dark:text-purple-400" />
            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Top Issue</p>
          </div>
          <p className="text-sm font-bold text-purple-900 dark:text-purple-100 truncate">{stats.topCategory}</p>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className={`rounded-xl p-4 border ${getTrendColor()}`}>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <p className="font-bold">Trend: {getTrendText()}</p>
        </div>
        <p className="text-sm mt-1 opacity-80">
          {stats.trend === 'increasing' && 'New complaints are rising in this area'}
          {stats.trend === 'decreasing' && 'Situation is improving in this area'}
          {stats.trend === 'stable' && 'Complaint rate is stable'}
        </p>
      </div>
    </div>
  );
}
