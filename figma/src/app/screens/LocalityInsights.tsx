import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { Button } from '../components/Button';
import { LocalitySearch } from '../components/LocalitySearch';
import { LocalitySummaryCard } from '../components/LocalitySummaryCard';
import { ComplaintMap } from '../components/ComplaintMap';
import { ComplaintCategoryChart } from '../components/ComplaintCategoryChart';
import { ComplaintTimelineChart } from '../components/ComplaintTimelineChart';
import { AreaRankingList } from '../components/AreaRankingList';
import { ComplaintFilters } from '../components/ComplaintFilters';
import { ComplaintPreviewCard } from '../components/ComplaintPreviewCard';
import { ArrowLeft, AlertCircle, MapPin, BarChart3 } from 'lucide-react';

export function LocalityInsights() {
  const navigate = useNavigate();
  const { localities, getLocalityStats, getAllLocalityStats } = useData();
  const [selectedLocality, setSelectedLocality] = useState<string>('Sector 4');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    timeRange: 'all' as 'all' | '7days' | '30days',
    category: 'all' as string,
    status: 'all' as 'all' | 'pending' | 'resolved',
  });

  const localityStats = useMemo(() => getLocalityStats(selectedLocality), [selectedLocality, getLocalityStats]);
  const allLocalityStats = useMemo(() => getAllLocalityStats(), [getAllLocalityStats]);

  // Apply filters to complaints
  const filteredComplaints = useMemo(() => {
    let filtered = localityStats.complaints;

    // Time range filter
    if (filters.timeRange === '7days') {
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((c) => c.timestamp > cutoff);
    } else if (filters.timeRange === '30days') {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((c) => c.timestamp > cutoff);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter((c) => c.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((c) => c.status === filters.status);
    }

    return filtered;
  }, [localityStats.complaints, filters]);

  const selectedComplaint = selectedComplaintId
    ? localityStats.complaints.find((c) => c.id === selectedComplaintId)
    : null;

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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Locality Issues</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Public Transparency Dashboard</p>
          </div>
        </div>

        {/* Public Notice Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800/50 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <MapPin size={24} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-blue-900 dark:text-blue-300 mb-1">Public Transparency</h2>
            <p className="text-blue-700 dark:text-blue-200 text-sm">
              View waste issues in your area. No login required. Help keep your community clean!
            </p>
          </div>
        </div>

        {/* Locality Search */}
        <div className="mb-6">
          <LocalitySearch
            localities={localities}
            selectedLocality={selectedLocality}
            onLocalityChange={setSelectedLocality}
          />
        </div>

        {/* Summary Card */}
        <div className="mb-6">
          <LocalitySummaryCard stats={localityStats} />
        </div>

        {/* CTA Button */}
        <div className="mb-6">
          <Button
            icon={AlertCircle}
            variant="danger"
            fullWidth
            onClick={() => navigate('/report')}
          >
            Report Issue in This Area
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ComplaintFilters
            filters={filters}
            onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
          />
        </div>

        {/* Map View */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-gray-700 dark:text-gray-300" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Complaint Map</h3>
            </div>
            <ComplaintMap
              complaints={filteredComplaints}
              localities={localities}
              selectedLocality={selectedLocality}
              onComplaintClick={setSelectedComplaintId}
            />
          </div>
        </div>

        {/* Complaint Preview */}
        {selectedComplaint && (
          <div className="mb-6">
            <ComplaintPreviewCard
              complaint={selectedComplaint}
              onClose={() => setSelectedComplaintId(null)}
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Category Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} className="text-gray-700 dark:text-gray-300" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Complaints by Category</h3>
            </div>
            <ComplaintCategoryChart complaints={filteredComplaints} />
          </div>

          {/* Timeline Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} className="text-gray-700 dark:text-gray-300" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Complaints Over Time</h3>
            </div>
            <ComplaintTimelineChart complaints={filteredComplaints} />
          </div>
        </div>

        {/* Area Rankings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Top Problematic Areas</h3>
          <AreaRankingList stats={allLocalityStats} onAreaClick={setSelectedLocality} />
        </div>
      </div>
    </div>
  );
}
