import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Camera, AlertCircle, Leaf, MapPin } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full pb-24 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-950">
      <div className="px-4 py-8 pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-4 shadow-lg shadow-green-500/20">
            <Leaf size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Waste Segregation System</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Keep your community clean</p>
        </div>

        {/* Awareness Banner */}
        <div className="bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Why Segregate Waste?</h2>
          <p className="text-green-700 dark:text-green-400">
            Proper waste sorting helps recycling and keeps our environment clean. 
            Take a photo to learn the correct way to dispose!
          </p>
        </div>

        {/* Main Actions */}
        <div className="space-y-4 mb-8">
          <Button
            icon={Camera}
            variant="primary"
            fullWidth
            onClick={() => navigate('/classify')}
          >
            Check Waste Type
          </Button>
          
          <Button
            icon={AlertCircle}
            variant="danger"
            fullWidth
            onClick={() => navigate('/report')}
          >
            Report Garbage Issue
          </Button>

          <Button
            icon={MapPin}
            variant="secondary"
            fullWidth
            onClick={() => navigate('/locality')}
          >
            View Locality Issues
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border-2 border-green-200 dark:border-green-800/50">
            <div className="text-3xl mb-2">💧</div>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">Wet Waste</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border-2 border-blue-200 dark:border-blue-800/50">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-400">Dry Waste</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center border-2 border-red-200 dark:border-red-800/50">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-sm font-bold text-red-700 dark:text-red-400">Hazardous</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center border-2 border-orange-200 dark:border-orange-800/50">
            <div className="text-3xl mb-2">📱</div>
            <p className="text-sm font-bold text-orange-700 dark:text-orange-400">E-Waste</p>
          </div>
        </div>
      </div>
    </div>
  );
}