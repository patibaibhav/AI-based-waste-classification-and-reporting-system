import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ImageUpload } from '../components/ImageUpload';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { WasteCategoryCard } from '../components/WasteCategoryCard';
import { useData, WasteCategory, WasteResult } from '../context/DataContext';
import { ArrowLeft, Sparkles, CheckCircle, Info, AlertCircle, Camera } from 'lucide-react';

export function WasteClassification() {
  const navigate = useNavigate();
  const { addWasteResult } = useData();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WasteResult | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
    setAnalysisResult(null); // Clear previous result when new image is selected
  };

  const handleAnalyze = () => {
    if (!imageFile || !imagePreview) return;

    console.log('Starting waste analysis...');
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate AI analysis
    setTimeout(() => {
      // Mock AI result - Updated waste classification with new categories
      const wasteTypes = [
        {
          category: 'wet' as WasteCategory,
          confidence: Math.floor(Math.random() * 10) + 88,
          disposalSuggestion: 'Place in GREEN bin for wet waste. This includes food scraps, vegetable peels, fruit waste, and other biodegradable organic materials. Keep separate from dry waste for composting.',
        },
        {
          category: 'dry' as WasteCategory,
          confidence: Math.floor(Math.random() * 10) + 87,
          disposalSuggestion: 'Place in BLUE bin for dry waste. This includes paper, plastic, metal, glass, and other recyclable materials. Clean and dry items before disposal to maintain recyclability.',
        },
        {
          category: 'hazardous' as WasteCategory,
          confidence: Math.floor(Math.random() * 10) + 85,
          disposalSuggestion: 'Place in RED bin for hazardous waste. This includes batteries, chemicals, medical waste, and toxic materials. Handle with extreme care and follow special disposal guidelines.',
        },
        {
          category: 'e-waste' as WasteCategory,
          confidence: Math.floor(Math.random() * 10) + 86,
          disposalSuggestion: 'Take to designated E-WASTE collection center. This includes phones, computers, chargers, and other electronic devices. Do not mix with regular waste as electronics contain valuable and harmful materials.',
        },
      ];

      const randomIndex = Math.floor(Math.random() * wasteTypes.length);
      const selectedType = wasteTypes[randomIndex];

      const result: WasteResult = {
        id: Date.now().toString(),
        imageUrl: imagePreview,
        category: selectedType.category,
        confidence: selectedType.confidence,
        disposalSuggestion: selectedType.disposalSuggestion,
        timestamp: new Date(),
      };

      console.log('Analysis complete! Result:', result);

      // Save to context
      addWasteResult({
        imageUrl: result.imageUrl,
        category: result.category,
        confidence: result.confidence,
        disposalSuggestion: result.disposalSuggestion,
      });

      setIsAnalyzing(false);
      setAnalysisResult(result);
    }, 2500);
  };

  const handleScanAnother = () => {
    setImageFile(null);
    setImagePreview('');
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-full pb-24 bg-gray-50 dark:bg-gray-950">
      <div className="px-4 py-6 pt-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-gray-100" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Check Waste Type</h1>
        </div>

        {isAnalyzing ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mt-8 border-2 border-blue-300 dark:border-blue-800">
            <LoadingSpinner message="Analyzing waste type..." />
            <div className="text-center mt-6 space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Our AI is identifying the waste category</p>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">
                  🔍 Scanning image patterns...<br />
                  🧠 Processing with AI model...<br />
                  ✨ Determining waste type...
                </p>
              </div>
            </div>
          </div>
        ) : analysisResult ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-800 rounded-2xl p-5 flex items-start gap-3">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-green-900 dark:text-green-100 mb-1">Analysis Complete!</h2>
                <p className="text-green-700 dark:text-green-300 text-sm">We've identified your waste type</p>
              </div>
            </div>

            {/* Image Preview */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-800">
              <img
                src={analysisResult.imageUrl}
                alt="Analyzed waste"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>

            {/* Category Card */}
            <div>
              <WasteCategoryCard
                category={analysisResult.category}
                confidence={analysisResult.confidence}
              />
            </div>

            {/* Disposal Instructions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Info size={24} className="text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">How to Dispose</h3>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800/50">
                <p className="text-blue-900 dark:text-blue-100 leading-relaxed font-medium text-lg">
                  {analysisResult.disposalSuggestion}
                </p>
              </div>
            </div>

            {/* Additional Tips */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-5 border-2 border-yellow-200 dark:border-yellow-800/50">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-400 mb-2 flex items-center gap-2">
                💡 Quick Tips
              </h3>
              <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-2 list-disc list-inside">
                {analysisResult.category === 'wet' && (
                  <>
                    <li>Keep food waste separate from recyclables</li>
                    <li>Compost at home if possible for garden use</li>
                    <li>Avoid mixing with plastic or other materials</li>
                  </>
                )}
                {analysisResult.category === 'dry' && (
                  <>
                    <li>Clean and rinse containers before disposal</li>
                    <li>Remove labels and caps when possible</li>
                    <li>Keep dry to maintain recyclability</li>
                  </>
                )}
                {analysisResult.category === 'hazardous' && (
                  <>
                    <li>Wrap sharp items safely to prevent injuries</li>
                    <li>Consider reducing use of such materials</li>
                    <li>Look for reusable alternatives</li>
                  </>
                )}
                {analysisResult.category === 'e-waste' && (
                  <>
                    <li>Do not mix with regular waste</li>
                    <li>Handle with care to avoid damage</li>
                    <li>Check for local e-waste collection centers</li>
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
                onClick={() => navigate('/report', { state: { fromResult: true, imageUrl: analysisResult.imageUrl } })}
              >
                Report This Area
              </Button>

              <Button
                icon={Camera}
                variant="secondary"
                fullWidth
                onClick={handleScanAnother}
              >
                Scan Another Item
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800/50 rounded-2xl p-5 mb-6">
              <h2 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Sparkles size={20} />
                How it works
              </h2>
              <ol className="text-blue-800 dark:text-blue-200 space-y-1 text-sm list-decimal list-inside">
                <li>Take a clear photo of the waste item</li>
                <li>Tap "Analyze Waste" button</li>
                <li>Get category and disposal instructions</li>
              </ol>
            </div>

            {/* Image Upload */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <ImageUpload onImageSelect={handleImageSelect} preview={imagePreview} />
            </div>

            {/* Analyze Button */}
            <Button
              icon={Sparkles}
              variant="success"
              fullWidth
              onClick={handleAnalyze}
              disabled={!imageFile}
            >
              Analyze Waste
            </Button>
          </>
        )}
      </div>
    </div>
  );
}