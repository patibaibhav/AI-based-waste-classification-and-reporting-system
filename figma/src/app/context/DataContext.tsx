import React, { createContext, useContext, useState, ReactNode } from 'react';

export type WasteCategory = 'dry' | 'wet' | 'hazardous' | 'e-waste';

export interface WasteResult {
  id: string;
  imageUrl: string;
  category: WasteCategory;
  confidence: number;
  timestamp: Date;
  disposalSuggestion: string;
}

export interface Complaint {
  id: string;
  imageUrl: string;
  location: string;
  category: string;
  description: string;
  status: 'pending' | 'resolved';
  timestamp: Date;
  latitude?: number;
  longitude?: number;
}

export interface Locality {
  id: string;
  name: string;
  area: string;
  latitude: number;
  longitude: number;
}

export interface LocalityStats {
  locality: string;
  total: number;
  pending: number;
  resolved: number;
  topCategory: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  complaints: Complaint[];
}

interface DataContextType {
  complaints: Complaint[];
  wasteResults: WasteResult[];
  localities: Locality[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'timestamp' | 'status'>) => void;
  addWasteResult: (result: Omit<WasteResult, 'id' | 'timestamp'>) => void;
  updateComplaintStatus: (id: string, status: 'pending' | 'resolved') => void;
  getComplaintStats: () => {
    total: number;
    pending: number;
    resolved: number;
    topCategory: string;
  };
  getLocalityStats: (localityName: string) => LocalityStats;
  getAllLocalityStats: () => LocalityStats[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock localities
const mockLocalities: Locality[] = [
  { id: '1', name: 'Sector 4', area: 'MG Road Area', latitude: 28.5355, longitude: 77.3910 },
  { id: '2', name: 'Sector 2', area: 'Park Street Area', latitude: 28.5375, longitude: 77.3890 },
  { id: '3', name: 'Central Market', area: 'Market Area', latitude: 28.5365, longitude: 77.3950 },
  { id: '4', name: 'Sector 7', area: 'Residential Area', latitude: 28.5345, longitude: 77.3870 },
  { id: '5', name: 'Sector 10', area: 'Industrial Area', latitude: 28.5385, longitude: 77.3930 },
];

// Mock initial data
const mockComplaints: Complaint[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400',
    location: 'MG Road, Sector 4',
    category: 'Illegal Dumping',
    description: 'Large pile of waste blocking the street',
    status: 'pending',
    timestamp: new Date('2026-02-18'),
    latitude: 28.5355,
    longitude: 77.3910,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
    location: 'Park Street, Sector 2',
    category: 'Overflowing Bin',
    description: 'Dustbin overflowing for 3 days',
    status: 'resolved',
    timestamp: new Date('2026-02-15'),
    latitude: 28.5375,
    longitude: 77.3890,
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
    location: 'Market Area, Central',
    category: 'Littering',
    description: 'Plastic waste scattered around market',
    status: 'pending',
    timestamp: new Date('2026-02-19'),
    latitude: 28.5365,
    longitude: 77.3950,
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
    location: 'Main Street, Sector 4',
    category: 'Illegal Dumping',
    description: 'Construction waste dumped on roadside',
    status: 'pending',
    timestamp: new Date('2026-02-17'),
    latitude: 28.5358,
    longitude: 77.3915,
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
    location: 'Garden Area, Sector 2',
    category: 'Overflowing Bin',
    description: 'Multiple bins overflowing in park',
    status: 'pending',
    timestamp: new Date('2026-02-16'),
    latitude: 28.5372,
    longitude: 77.3885,
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
    location: 'Shop Complex, Central Market',
    category: 'Littering',
    description: 'Food waste thrown outside shops',
    status: 'resolved',
    timestamp: new Date('2026-02-14'),
    latitude: 28.5368,
    longitude: 77.3948,
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400',
    location: 'Housing Colony, Sector 7',
    category: 'Illegal Dumping',
    description: 'Waste burning in open area',
    status: 'pending',
    timestamp: new Date('2026-02-19'),
    latitude: 28.5345,
    longitude: 77.3870,
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
    location: 'Factory Road, Sector 10',
    category: 'Overflowing Bin',
    description: 'Industrial waste bins need clearing',
    status: 'resolved',
    timestamp: new Date('2026-02-13'),
    latitude: 28.5385,
    longitude: 77.3930,
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
    location: 'Bus Stop, Sector 4',
    category: 'Littering',
    description: 'Plastic bottles and wrappers everywhere',
    status: 'pending',
    timestamp: new Date('2026-02-18'),
    latitude: 28.5352,
    longitude: 77.3912,
  },
  {
    id: '10',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400',
    location: 'School Area, Sector 2',
    category: 'Illegal Dumping',
    description: 'Old furniture dumped near school',
    status: 'resolved',
    timestamp: new Date('2026-02-12'),
    latitude: 28.5378,
    longitude: 77.3892,
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [wasteResults, setWasteResults] = useState<WasteResult[]>([]);
  const [localities, setLocalities] = useState<Locality[]>(mockLocalities);

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'timestamp' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'pending',
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const addWasteResult = (result: Omit<WasteResult, 'id' | 'timestamp'>) => {
    const newResult: WasteResult = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setWasteResults((prev) => [newResult, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: 'pending' | 'resolved') => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
  };

  const getComplaintStats = () => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'pending').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    
    const categoryCounts: Record<string, number> = {};
    complaints.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });
    
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return { total, pending, resolved, topCategory };
  };

  const getLocalityStats = (localityName: string) => {
    const locality = localities.find((l) => l.name === localityName);
    if (!locality) {
      return {
        locality: localityName,
        total: 0,
        pending: 0,
        resolved: 0,
        topCategory: 'N/A',
        trend: 'stable',
        complaints: [],
      };
    }

    const localityComplaints = complaints.filter(
      (c) =>
        c.latitude &&
        c.longitude &&
        Math.abs(c.latitude - locality.latitude) < 0.005 &&
        Math.abs(c.longitude - locality.longitude) < 0.005
    );

    const total = localityComplaints.length;
    const pending = localityComplaints.filter((c) => c.status === 'pending').length;
    const resolved = localityComplaints.filter((c) => c.status === 'resolved').length;
    
    const categoryCounts: Record<string, number> = {};
    localityComplaints.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });
    
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Determine trend based on the last 5 days
    const recentComplaints = localityComplaints.filter(
      (c) => c.timestamp > new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    );
    const recentPending = recentComplaints.filter((c) => c.status === 'pending').length;
    const recentResolved = recentComplaints.filter((c) => c.status === 'resolved').length;
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentPending > recentResolved) {
      trend = 'increasing';
    } else if (recentResolved > recentPending) {
      trend = 'decreasing';
    }

    return { locality: localityName, total, pending, resolved, topCategory, trend, complaints: localityComplaints };
  };

  const getAllLocalityStats = () => {
    return localities.map((l) => getLocalityStats(l.name));
  };

  return (
    <DataContext.Provider
      value={{
        complaints,
        wasteResults,
        localities,
        addComplaint,
        addWasteResult,
        updateComplaintStatus,
        getComplaintStats,
        getLocalityStats,
        getAllLocalityStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}