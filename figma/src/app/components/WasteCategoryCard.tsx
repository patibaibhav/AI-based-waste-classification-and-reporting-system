import React from 'react';
import { WasteCategory } from '../context/DataContext';
import { Droplets, FileText, AlertTriangle, Smartphone } from 'lucide-react';

interface WasteCategoryCardProps {
  category: WasteCategory;
  confidence: number;
}

export function WasteCategoryCard({ category, confidence }: WasteCategoryCardProps) {
  const categoryConfig = {
    wet: {
      icon: Droplets,
      color: 'bg-green-600 dark:bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      borderColor: 'border-green-300 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-300',
      label: 'Wet Waste',
      description: 'Biodegradable organic waste',
    },
    dry: {
      icon: FileText,
      color: 'bg-blue-600 dark:bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'border-blue-300 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-300',
      label: 'Dry Waste',
      description: 'Recyclable materials',
    },
    hazardous: {
      icon: AlertTriangle,
      color: 'bg-red-600 dark:bg-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'border-red-300 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-300',
      label: 'Hazardous Waste',
      description: 'Dangerous materials',
    },
    'e-waste': {
      icon: Smartphone,
      color: 'bg-orange-600 dark:bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      borderColor: 'border-orange-300 dark:border-orange-800',
      textColor: 'text-orange-800 dark:text-orange-300',
      label: 'E-Waste',
      description: 'Electronic waste',
    },
  };

  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} rounded-2xl p-6 border-2 ${config.borderColor}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`${config.color} text-white p-4 rounded-full`}>
          <Icon size={32} />
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${config.textColor}`}>{config.label}</h3>
          <p className={`text-sm ${config.textColor} opacity-75`}>{config.description}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${config.textColor}`}>Confidence Level</span>
          <span className={`text-lg font-bold ${config.textColor}`}>{confidence}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-3 overflow-hidden">
          <div
            className={`${config.color} h-full transition-all duration-500`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}