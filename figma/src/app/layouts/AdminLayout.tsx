import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminLayout() {
  const [isDark, setIsDark] = useState(false);
  const { isAuthenticated, userType } = useAuth();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect non-admin users to home
  if (userType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-gray-50 dark:bg-gray-950 relative shadow-2xl flex flex-col">
        {/* Theme Toggle Top Bar */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg text-gray-800 dark:text-gray-200"
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}