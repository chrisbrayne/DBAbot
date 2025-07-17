import React, { useEffect, useRef } from 'react';
import { MapPin, Circle } from 'lucide-react';
import { ArchaeologicalSite } from '../types/archaeological';

interface MapViewProps {
  centroid: [number, number];
  sites: ArchaeologicalSite[];
}

export const MapView: React.FC<MapViewProps> = ({ centroid, sites }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock map implementation - in production, would use Leaflet or similar
  const getMarkerColor = (type: ArchaeologicalSite['type']) => {
    switch (type) {
      case 'scheduled_monument': return 'text-red-600';
      case 'listed_building': return 'text-blue-600';
      case 'conservation_area': return 'text-green-600';
      case 'archaeological_site': return 'text-purple-600';
      case 'findspot': return 'text-orange-600';
      default: return 'text-stone-600';
    }
  };

  const getSignificanceSize = (significance: ArchaeologicalSite['significance']) => {
    switch (significance) {
      case 'international': return 'h-8 w-8';
      case 'national': return 'h-7 w-7';
      case 'regional': return 'h-6 w-6';
      case 'local': return 'h-5 w-5';
      default: return 'h-5 w-5';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-stone-800">Heritage Assets Map</h3>
        <div className="text-sm text-stone-600 flex items-center gap-4">
          <span>Study Area: 20km radius from {centroid[0].toFixed(4)}, {centroid[1].toFixed(4)}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            Historic England NHLE Data
          </span>
        </div>
      </div>

      {/* Mock Map Display */}
      <div className="relative bg-stone-100 rounded-lg border-2 border-stone-200 h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
          {/* Study area circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Circle className="h-64 w-64 text-amber-300 opacity-30" />
          </div>
          
          {/* Centroid marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <MapPin className="h-6 w-6 text-amber-600" />
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow">
              Site Location
            </div>
          </div>

          {/* Archaeological sites */}
          {sites.slice(0, 8).map((site, index) => (
            <div
              key={site.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{
                top: `${40 + (index % 4) * 15}%`,
                left: `${30 + (index % 5) * 15}%`,
              }}
            >
              <MapPin className={`${getMarkerColor(site.type)} ${getSignificanceSize(site.significance)}`} />
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {site.name}
                <br />
                {site.period} | {site.distance.toFixed(1)}km
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow">
          <div className="text-sm font-medium text-stone-800 mb-2">Legend</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <span>Scheduled Monument</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>Listed Building</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span>Conservation Area</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span>Archaeological Site</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-600" />
              <span>Findspot</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-stone-50 p-4 rounded-lg">
          <h4 className="font-medium text-stone-800 mb-2">Total Heritage Assets</h4>
          <div className="text-2xl font-bold text-amber-600">{sites.length}</div>
          <div className="text-xs text-stone-500 mt-1">NHLE Records</div>
        </div>
        <div className="bg-stone-50 p-4 rounded-lg">
          <h4 className="font-medium text-stone-800 mb-2">Scheduled Monuments</h4>
          <div className="text-2xl font-bold text-red-600">
            {sites.filter(s => s.type === 'scheduled_monument').length}
          </div>
        </div>
        <div className="bg-stone-50 p-4 rounded-lg">
          <h4 className="font-medium text-stone-800 mb-2">Listed Buildings</h4>
          <div className="text-2xl font-bold text-blue-600">
            {sites.filter(s => s.type === 'listed_building').length}
          </div>
        </div>
      </div>
    </div>
  );
};