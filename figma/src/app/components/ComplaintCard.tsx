import React from 'react';
import { Complaint } from '../context/DataContext';
import { StatusChip } from './StatusChip';
import { MapPin, Calendar } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
}

export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  const formattedDate = complaint.timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 ${
        onClick ? 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors' : ''
      }`}
    >
      <div className="flex gap-4 p-4">
        <img
          src={complaint.imageUrl}
          alt={complaint.category}
          className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{complaint.category}</h3>
            <StatusChip status={complaint.status} />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
            <MapPin size={16} />
            <span className="truncate">{complaint.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
