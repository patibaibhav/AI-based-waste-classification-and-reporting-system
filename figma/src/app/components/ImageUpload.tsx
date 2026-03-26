import React, { useRef, ChangeEvent } from 'react';
import { Camera, Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview?: string;
}

export function ImageUpload({ onImageSelect, preview }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-2xl"
          />
          <button
            type="button"
            onClick={handleClick}
            className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Camera size={20} />
            Change Photo
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full h-64 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-4"
        >
          <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-full">
            <Upload size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">Upload Photo</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tap to take or choose image</p>
          </div>
        </button>
      )}
    </div>
  );
}
