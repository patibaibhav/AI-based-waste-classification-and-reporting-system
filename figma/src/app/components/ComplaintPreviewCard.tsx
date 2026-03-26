import React from 'react';
import { X, MapPin, Calendar, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import { Complaint } from '../context/DataContext';
import { format } from 'date-fns';

interface ComplaintPreviewCardProps {
  complaint: Complaint;
  onClose: () => void;
}

export function ComplaintPreviewCard({ complaint, onClose }: ComplaintPreviewCardProps) {
  const isPending = complaint.status === 'pending';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-blue-300 dark:border-blue-800 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {isPending ? (
            <AlertCircle size={24} className="text-orange-500 dark:text-orange-400" />
          ) : (
            <CheckCircle size={24} className="text-green-500 dark:text-green-400" />
          )}
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Complaint Details</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="mb-4">
        <img
          src={complaint.imageUrl}
          alt="Complaint"
          className="w-full h-48 object-cover rounded-xl"
        />
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${
            isPending
              ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'
              : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
          }`}
        >
          {isPending ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {isPending ? 'Pending' : 'Resolved'}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{complaint.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Tag size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{complaint.category}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Reported</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{format(complaint.timestamp, 'PPP')}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
          <p className="font-medium bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-lg">{complaint.description}</p>
        </div>
      </div>
    </div>
  );
}
