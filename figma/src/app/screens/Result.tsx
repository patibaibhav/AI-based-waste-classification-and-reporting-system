import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/Button';
import { WasteCategoryCard } from '../components/WasteCategoryCard';
import { ArrowLeft, Camera, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { WasteResult } from '../context/DataContext';

export function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result as WasteResult;

  // Debug logging
  console.log('Result screen - location.state:', location.state);
  console.log('Result screen - result:', result);

  React.useEffect(() => {
    if (!result) {
      console.log('No result found, redirecting to classify');
      navigate('/classify');
    }
  }, [result, navigate]);

  if (!result) {
    return (
      <div className="min-h-screen pb-24 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading result...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-3 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Waste Analysis Result</h1>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-green-900 mb-1">Analysis Complete!</h2>
            <p className="text-green-700 text-sm">We've identified your waste type</p>
          </div>
        </div>

        {/* Image Preview */}
        {result.imageUrl && (
          <div className="bg-white rounded-2xl p-4 mb-6 border-2 border-gray-200">
            <img
              src={result.imageUrl}
              alt="Analyzed waste"
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Category Card */}
        <div className="mb-6">
          <WasteCategoryCard category={result.category} confidence={result.confidence} />
        </div>

        {/* Disposal Instructions - Enhanced */}
        <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Info size={24} className="text-blue-600" />
            <h3 className="font-bold text-xl">How to Dispose</h3>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
            <p className="text-blue-900 leading-relaxed font-medium text-lg">
              {result.disposalSuggestion || 'Disposal instructions not available'}
            </p>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="bg-yellow-50 rounded-2xl p-5 mb-6 border-2 border-yellow-200">
          <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
            💡 Quick Tips
          </h3>
          <ul className="text-yellow-800 text-sm space-y-2 list-disc list-inside">
            {result.category === 'wet' && (
              <>
                <li>Keep food waste separate from recyclables</li>
                <li>Compost at home if possible for garden use</li>
                <li>Avoid mixing with plastic or other materials</li>
              </>
            )}
            {result.category === 'dry' && (
              <>
                <li>Clean and rinse containers before disposal</li>
                <li>Remove labels and caps when possible</li>
                <li>Keep dry to maintain recyclability</li>
              </>
            )}
            {result.category === 'hazardous' && (
              <>
                <li>Wrap sharp items safely to prevent injuries</li>
                <li>Never mix with regular household waste</li>
                <li>Follow safety guidelines when handling</li>
              </>
            )}
            {result.category === 'e-waste' && (
              <>
                <li>Do not throw in regular bins</li>
                <li>Remove batteries before disposal if possible</li>
                <li>Find authorized e-waste collection centers</li>
              </>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            icon={AlertCircle}
            variant="danger"
            fullWidth
            onClick={() => navigate('/report', { state: { fromResult: true, imageUrl: result.imageUrl } })}
          >
            Report This Area
          </Button>
          
          <Button
            icon={Camera}
            variant="secondary"
            fullWidth
            onClick={() => navigate('/classify')}
          >
            Scan Another Item
          </Button>
        </div>
      </div>
    </div>
  );
}