import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { ComplaintCard } from '../components/ComplaintCard';
import { Button } from '../components/Button';
import { ArrowLeft, Filter, X } from 'lucide-react';

export function ComplaintManagement() {
  const navigate = useNavigate();
  const { complaints, updateComplaintStatus } = useData();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(complaints.map((c) => c.category)))];

  const filteredComplaints = complaints.filter((complaint) => {
    if (statusFilter !== 'all' && complaint.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && complaint.category !== categoryFilter) return false;
    return true;
  });

  const selectedComplaintData = complaints.find((c) => c.id === selectedComplaint);

  const handleResolve = (id: string) => {
    updateComplaintStatus(id, 'resolved');
    setSelectedComplaint(null);
  };

  const handleReopen = (id: string) => {
    updateComplaintStatus(id, 'pending');
    setSelectedComplaint(null);
  };

  return (
    <div className="px-4 py-6 pt-16 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-900 dark:text-gray-100" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Complaint Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600 dark:text-gray-400" />
          <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </div>
      </div>

      {/* Main Layout - Modified for Mobile */}
      {selectedComplaintData ? (
        /* Detail Panel (Mobile specific approach: overlaps or hides list) */
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border-2 border-blue-300 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Complaint Details</h2>
            <button
              onClick={() => setSelectedComplaint(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <X size={20} className="text-gray-900 dark:text-gray-100" />
            </button>
          </div>

          <img
            src={selectedComplaintData.imageUrl}
            alt={selectedComplaintData.category}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</label>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedComplaintData.category}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
              <p className="text-lg text-gray-900 dark:text-gray-100">{selectedComplaintData.location}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
              <p className="text-lg text-gray-900 dark:text-gray-100">{selectedComplaintData.description}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Submitted</label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {selectedComplaintData.timestamp.toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {selectedComplaintData.status === 'pending' ? (
              <Button
                variant="success"
                fullWidth
                size="medium"
                onClick={() => handleResolve(selectedComplaintData.id)}
              >
                Mark as Resolved
              </Button>
            ) : (
              <Button
                variant="secondary"
                fullWidth
                size="medium"
                onClick={() => handleReopen(selectedComplaintData.id)}
              >
                Reopen Complaint
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Complaints List */
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">No complaints match your filters</p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => setSelectedComplaint(complaint.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}