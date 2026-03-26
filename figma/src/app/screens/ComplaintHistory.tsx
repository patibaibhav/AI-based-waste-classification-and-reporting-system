import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { ComplaintCard } from '../components/ComplaintCard';
import { ArrowLeft, Filter, Inbox } from 'lucide-react';

export function ComplaintHistory() {
  const navigate = useNavigate();
  const { complaints } = useData();
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const filteredComplaints = complaints.filter((complaint) => {
    if (filter === 'all') return true;
    return complaint.status === filter;
  });

  return (
    <div className="min-h-full pb-24 bg-gray-50 dark:bg-gray-950">
      <div className="px-4 py-6 pt-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-gray-100" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Reports</h1>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 mb-6 flex gap-2 border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 px-2 rounded-xl font-medium transition-colors text-sm ${
              filter === 'all'
                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All ({complaints.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-3 px-2 rounded-xl font-medium transition-colors text-sm ${
              filter === 'pending'
                ? 'bg-yellow-500 dark:bg-yellow-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Pending ({complaints.filter(c => c.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`flex-1 py-3 px-2 rounded-xl font-medium transition-colors text-sm ${
              filter === 'resolved'
                ? 'bg-green-600 dark:bg-green-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Resolved ({complaints.filter(c => c.status === 'resolved').length})
          </button>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800">
            <Inbox size={64} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">No Reports Found</h2>
            <p className="text-gray-500 dark:text-gray-500">
              {filter === 'all'
                ? "You haven't submitted any reports yet"
                : `No ${filter} reports`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
