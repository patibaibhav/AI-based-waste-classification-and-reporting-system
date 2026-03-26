import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ImageUpload } from '../components/ImageUpload';
import { Button } from '../components/Button';
import { useData } from '../context/DataContext';
import { ArrowLeft, MapPin, Send, CheckCircle } from 'lucide-react';

export function ComplaintReporting() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addComplaint } = useData();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [locationValue, setLocationValue] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Pre-fill image if coming from result screen
    if (location.state?.fromResult && location.state?.imageUrl) {
      setImagePreview(location.state.imageUrl);
    }
  }, [location.state]);

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleGetLocation = () => {
    // Simulate getting current location
    setLocationValue('Current Location - GPS Coordinates');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagePreview || !locationValue || !category || !description) {
      return;
    }

    addComplaint({
      imageUrl: imagePreview,
      location: locationValue,
      category,
      description,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-full pb-24 bg-gray-50 dark:bg-gray-950">
        <div className="px-4 py-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mt-20 text-center border border-gray-200 dark:border-gray-800">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Report Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Thank you for helping keep our community clean. We'll review your complaint soon.
            </p>
            <div className="space-y-3">
              <Button variant="primary" fullWidth onClick={() => navigate('/history')}>
                View My Reports
              </Button>
              <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24 bg-gray-50 dark:bg-gray-950">
      <div className="px-4 py-6 pt-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-gray-100" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Report Garbage Issue</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <label className="block font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Upload Photo*</label>
            <ImageUpload onImageSelect={handleImageSelect} preview={imagePreview} />
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <label className="block font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Location*</label>
            <div className="space-y-3">
              <Button
                type="button"
                icon={MapPin}
                variant="secondary"
                fullWidth
                onClick={handleGetLocation}
              >
                Get Current Location
              </Button>
              <input
                type="text"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                placeholder="Or type location manually"
                className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <label className="block font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Issue Type*</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none"
              required
            >
              <option value="">Select category</option>
              <option value="Illegal Dumping">Illegal Dumping</option>
              <option value="Overflowing Bin">Overflowing Bin</option>
              <option value="Littering">Littering</option>
              <option value="Blocked Drain">Blocked Drain</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <label className="block font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Description*</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in simple words"
              rows={4}
              className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            icon={Send}
            variant="success"
            fullWidth
            disabled={!imagePreview || !locationValue || !category || !description}
          >
            Submit Report
          </Button>
        </form>
      </div>
    </div>
  );
}
