import React from 'react';

interface StatusChipProps {
  status: 'pending' | 'resolved';
}

export function StatusChip({ status }: StatusChipProps) {
  const isResolved = status === 'resolved';
  
  return (
    <span
      className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium ${
        isResolved
          ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
          : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300'
      }`}
    >
      {isResolved ? 'Resolved' : 'Pending'}
    </span>
  );
}
