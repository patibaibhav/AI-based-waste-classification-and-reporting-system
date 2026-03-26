import React from 'react';
import { MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import { LocalityStats } from '../context/DataContext';

interface AreaRankingListProps {
  stats: LocalityStats[];
  onAreaClick: (locality: string) => void;
}

export function AreaRankingList({ stats, onAreaClick }: AreaRankingListProps) {
  // Sort by total complaints (descending)
  const rankedStats = [...stats].sort((a, b) => b.total - a.total);

  const getSeverityColor = (pending: number, total: number) => {
    if (total === 0) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50';
    const ratio = pending / total;
    if (ratio > 0.7) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50';
    if (ratio > 0.4) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50';
    return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50';
  };

  const getSeverityDot = (pending: number, total: number) => {
    if (total === 0) return 'bg-green-500';
    const ratio = pending / total;
    if (ratio > 0.7) return 'bg-red-500';
    if (ratio > 0.4) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  if (rankedStats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rankedStats.map((stat, index) => (
        <button
          key={stat.locality}
          onClick={() => onAreaClick(stat.locality)}
          className={`w-full rounded-xl p-4 border-2 ${getSeverityColor(
            stat.pending,
            stat.total
          )} hover:shadow-lg transition-shadow text-left`}
        >
          <div className="flex items-start gap-4">
            {/* Rank Badge */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-800 dark:bg-gray-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {index + 1}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={18} className="text-gray-600 dark:text-gray-400 flex-shrink-0" />
                <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{stat.locality}</h4>
                <div className={`w-3 h-3 rounded-full ${getSeverityDot(stat.pending, stat.total)} flex-shrink-0`}></div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                <div className="flex items-center gap-1">
                  <AlertCircle size={14} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-300">{stat.total}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{stat.pending}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-400">Resolved:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{stat.resolved}</span>
                </div>
              </div>

              {/* Top Category */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg font-medium">
                  {stat.topCategory}
                </span>
                {stat.trend === 'increasing' && (
                  <span className="text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                    <TrendingUp size={12} />
                    Rising
                  </span>
                )}
                {stat.trend === 'decreasing' && (
                  <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg font-medium">
                    Improving
                  </span>
                )}
              </div>
            </div>

            {/* Resolution Rate */}
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resolved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stat.total > 0 ? Math.round((stat.resolved / stat.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
