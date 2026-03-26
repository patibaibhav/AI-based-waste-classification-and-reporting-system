import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { Complaint, Locality } from '../context/DataContext';

interface ComplaintMapProps {
  complaints: Complaint[];
  localities: Locality[];
  selectedLocality: string;
  onComplaintClick: (id: string) => void;
}

export function ComplaintMap({
  complaints,
  localities,
  selectedLocality,
  onComplaintClick,
}: ComplaintMapProps) {
  const locality = localities.find((l) => l.name === selectedLocality);

  if (!locality) {
    return (
      <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Select a locality to view map</p>
      </div>
    );
  }

  // Simple density heatmap visualization
  const getDensityColor = (count: number) => {
    if (count === 0) return 'bg-green-100';
    if (count <= 2) return 'bg-yellow-100';
    if (count <= 4) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const densityCount = complaints.length;

  return (
    <div className="relative">
      {/* Map Container with Heatmap Background */}
      <div className={`h-96 rounded-xl overflow-hidden ${getDensityColor(densityCount)} relative`}>
        {/* Heatmap Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5"></div>

        {/* Map Grid */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-gray-200/30"></div>
          ))}
        </div>

        {/* Locality Center Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full w-12 h-12 animate-ping opacity-20"></div>
            <div className="relative bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-4 border-white">
              <MapPin size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
              {selectedLocality}
            </div>
          </div>
        </div>

        {/* Complaint Markers */}
        {complaints.map((complaint, index) => {
          const offsetX = (index % 5 - 2) * 50 + Math.random() * 30 - 15;
          const offsetY = (Math.floor(index / 5) - 1) * 50 + Math.random() * 30 - 15;
          const isPending = complaint.status === 'pending';

          return (
            <button
              key={complaint.id}
              onClick={() => onComplaintClick(complaint.id)}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform ${
                isPending ? 'z-10' : 'z-5'
              }`}
              style={{
                marginLeft: `${offsetX}px`,
                marginTop: `${offsetY}px`,
              }}
              title={complaint.category}
            >
              <div className={`relative ${isPending ? 'animate-pulse' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                    isPending
                      ? 'bg-red-500 border-red-700'
                      : 'bg-green-500 border-green-700'
                  }`}
                >
                  <AlertCircle size={16} className="text-white" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-700"></div>
          <p className="text-sm text-gray-700">Pending</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-700"></div>
          <p className="text-sm text-gray-700">Resolved</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
          <p className="text-sm text-gray-700">Locality Center</p>
        </div>
      </div>

      {/* Density Indicator */}
      <div className="mt-4 bg-gray-100 rounded-xl p-4">
        <p className="text-sm font-bold mb-2">Complaint Density</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-4 rounded-full bg-gradient-to-r from-green-200 via-yellow-200 via-orange-200 to-red-200"></div>
          <p className="text-xs text-gray-600 font-medium">Low → High</p>
        </div>
      </div>
    </div>
  );
}
