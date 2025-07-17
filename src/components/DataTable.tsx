import React, { useState } from 'react';
import { Filter, ArrowUpDown, ExternalLink } from 'lucide-react';
import { ArchaeologicalSite } from '../types/archaeological';

interface DataTableProps {
  sites: ArchaeologicalSite[];
}

export const DataTable: React.FC<DataTableProps> = ({ sites }) => {
  const [sortField, setSortField] = useState<keyof ArchaeologicalSite>('distance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');

  const handleSort = (field: keyof ArchaeologicalSite) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSites = sites.filter(site => {
    if (filterType !== 'all' && site.type !== filterType) return false;
    if (filterPeriod !== 'all' && site.period !== filterPeriod) return false;
    return true;
  });

  const sortedSites = [...filteredSites].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const getTypeColor = (type: ArchaeologicalSite['type']) => {
    switch (type) {
      case 'scheduled_monument': return 'bg-red-100 text-red-800';
      case 'listed_building': return 'bg-blue-100 text-blue-800';
      case 'conservation_area': return 'bg-green-100 text-green-800';
      case 'archaeological_site': return 'bg-purple-100 text-purple-800';
      case 'findspot': return 'bg-orange-100 text-orange-800';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  const getSignificanceColor = (significance: ArchaeologicalSite['significance']) => {
    switch (significance) {
      case 'international': return 'bg-red-500 text-white';
      case 'national': return 'bg-orange-500 text-white';
      case 'regional': return 'bg-yellow-500 text-white';
      case 'local': return 'bg-green-500 text-white';
      default: return 'bg-stone-500 text-white';
    }
  };

  const uniqueTypes = [...new Set(sites.map(s => s.type))];
  const uniquePeriods = [...new Set(sites.map(s => s.period))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-stone-800">Heritage Assets Data</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-stone-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-stone-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="border border-stone-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Periods</option>
            {uniquePeriods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 font-medium text-stone-700 hover:text-stone-900"
                  >
                    Site Name
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('type')}
                    className="flex items-center gap-1 font-medium text-stone-700 hover:text-stone-900"
                  >
                    Type
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('period')}
                    className="flex items-center gap-1 font-medium text-stone-700 hover:text-stone-900"
                  >
                    Period
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('significance')}
                    className="flex items-center gap-1 font-medium text-stone-700 hover:text-stone-900"
                  >
                    Significance
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('distance')}
                    className="flex items-center gap-1 font-medium text-stone-700 hover:text-stone-900"
                  >
                    Distance (km)
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">NHLE Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {sortedSites.map((site) => (
                <tr key={site.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-900">{site.name}</div>
                    <div className="text-sm text-stone-500">
                      {site.coordinates[0].toFixed(4)}, {site.coordinates[1].toFixed(4)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(site.type)}`}>
                      {site.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-stone-900">{site.period}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getSignificanceColor(site.significance)}`}>
                      {site.significance}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-stone-900">{site.distance.toFixed(1)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-stone-600 max-w-xs truncate" title={site.description}>
                      {site.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {site.reference && (
                      <a 
                        href={(site as any).hyperlink || `https://historicengland.org.uk/listing/the-list/list-entry/${site.reference?.replace('NHLE ', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        <span className="text-sm">{site.reference}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-stone-600">
        Showing {sortedSites.length} of {sites.length} heritage assets from Historic England's National Heritage List within the study area
      </div>
    </div>
  );
};