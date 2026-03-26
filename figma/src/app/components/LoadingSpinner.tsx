import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2 size={48} className="text-blue-600 animate-spin" />
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
}
