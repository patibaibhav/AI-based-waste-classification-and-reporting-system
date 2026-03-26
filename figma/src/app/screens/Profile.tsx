import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Settings, HelpCircle, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const navigate = useNavigate();
  const { userType, userName, userEmail, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = userType === 'admin';

  return (
    <div className="min-h-full pb-24 bg-gray-50 dark:bg-gray-950">
      <div className="px-4 py-6 pt-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(isAdmin ? '/admin' : '/')}
            className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-gray-100" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-6 text-center border border-gray-200 dark:border-gray-800">
          <div className={`inline-flex items-center justify-center w-24 h-24 ${isAdmin ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'} rounded-full mb-4`}>
            {isAdmin ? (
              <ShieldCheck size={48} className="text-purple-600 dark:text-purple-400" />
            ) : (
              <User size={48} className="text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className={`inline-block px-4 py-1 rounded-full mb-3 ${isAdmin ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
            <span className="text-sm font-bold">{isAdmin ? 'Admin' : 'User'}</span>
          </div>
          <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">{userName || 'Community Member'}</h2>
          <p className="text-gray-600 dark:text-gray-400">{userEmail || 'user@example.com'}</p>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 transition-colors">
            <Settings size={24} className="text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-lg text-gray-900 dark:text-gray-100">Settings</span>
          </button>
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 transition-colors">
            <HelpCircle size={24} className="text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-lg text-gray-900 dark:text-gray-100">Help & Support</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-red-600 dark:text-red-500"
          >
            <LogOut size={24} />
            <span className="font-medium text-lg">Log Out</span>
          </button>
        </div>

        {/* Stats for Admin */}
        {isAdmin && (
          <div className="bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-800/50 rounded-2xl p-5 mt-6">
            <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-3">Admin Access</h3>
            <p className="text-purple-700 dark:text-purple-400 text-sm">
              You have full access to dashboard analytics and complaint management.
            </p>
          </div>
        )}

        {/* User info */}
        {!isAdmin && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800/50 rounded-2xl p-5 mt-6">
            <p className="text-blue-800 dark:text-blue-300 text-center font-medium">
              Keep your community clean by reporting waste issues
            </p>
          </div>
        )}
      </div>
    </div>
  );
}