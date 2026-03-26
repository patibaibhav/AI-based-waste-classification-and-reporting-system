import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Locality } from '../context/DataContext';

interface LocalitySearchProps {
  localities: Locality[];
  selectedLocality: string;
  onLocalityChange: (locality: string) => void;
}

export function LocalitySearch({ localities, selectedLocality, onLocalityChange }: LocalitySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredLocalities = localities.filter((locality) =>
    locality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    locality.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLocalityData = localities.find((l) => l.name === selectedLocality);

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Search size={24} className="text-gray-500 dark:text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Select Locality</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">{selectedLocalityData?.name || 'Choose area'}</p>
            {selectedLocalityData && (
              <p className="text-sm text-gray-600 dark:text-gray-500">{selectedLocalityData.area}</p>
            )}
          </div>
          <ChevronDown
            size={24}
            className={`text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-800">
            {/* Search Field */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-800">
              <input
                type="text"
                placeholder="Search locality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 text-lg rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Locality List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredLocalities.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No localities found
                </div>
              ) : (
                filteredLocalities.map((locality) => (
                  <button
                    key={locality.id}
                    onClick={() => {
                      onLocalityChange(locality.name);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left ${
                      locality.name === selectedLocality ? 'bg-blue-100 dark:bg-blue-900/50' : ''
                    }`}
                  >
                    <MapPin size={20} className="text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-gray-100">{locality.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{locality.area}</p>
                    </div>
                    {locality.name === selectedLocality && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Close overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
