import React from 'react';
import { Clock, MapPin, Building } from 'lucide-react';
import { ArchaeologicalSite } from '../types/archaeological';

interface ContextAnalysisProps {
  sites: ArchaeologicalSite[];
  postcode: string;
}

export const ContextAnalysis: React.FC<ContextAnalysisProps> = ({ sites, postcode }) => {
  const generateChronologicalContext = () => {
    const periodOrder = [
      'Palaeolithic', 'Mesolithic', 'Neolithic', 'Bronze Age', 'Iron Age',
      'Roman', 'Early Medieval', 'Medieval', 'Post Medieval', 'Modern'
    ];

    const sitesByPeriod = sites.reduce((acc, site) => {
      if (!acc[site.period]) acc[site.period] = [];
      acc[site.period].push(site);
      return acc;
    }, {} as Record<string, ArchaeologicalSite[]>);

    return periodOrder.filter(period => sitesByPeriod[period]).map(period => ({
      period,
      sites: sitesByPeriod[period]
    }));
  };

  const getGeographicalContext = () => {
    const scheduledCount = sites.filter(s => s.type === 'scheduled_monument').length;
    const listedCount = sites.filter(s => s.type === 'listed_building').length;
    const conservationCount = sites.filter(s => s.type === 'conservation_area').length;

    return {
      totalAssets: sites.length,
      scheduledCount,
      listedCount,
      conservationCount,
      averageDistance: sites.reduce((sum, s) => sum + s.distance, 0) / sites.length
    };
  };

  const chronologicalData = generateChronologicalContext();
  const geoContext = getGeographicalContext();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-amber-600" />
        <h3 className="text-xl font-semibold text-stone-800">Archaeological and Historical Context</h3>
      </div>

      {/* Geographical Context */}
      <div className="bg-stone-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-5 w-5 text-stone-600" />
          <h4 className="text-lg font-medium text-stone-800">Geographical Setting</h4>
        </div>
        <div className="prose text-stone-700">
          <p>
            The study area for postcode <strong>{postcode}</strong> encompasses a 20km radius containing{' '}
            <strong>{geoContext.totalAssets}</strong> heritage assets from Historic England's National Heritage List for England (NHLE). This includes{' '}
            <strong>{geoContext.scheduledCount}</strong> Scheduled Monuments,{' '}
            <strong>{geoContext.listedCount}</strong> Listed Buildings, and{' '}
            <strong>{geoContext.conservationCount}</strong> Conservation Areas.
          </p>
          <p>
            The average distance of heritage assets from the site centroid is{' '}
            <strong>{geoContext.averageDistance.toFixed(1)}km</strong>, indicating{' '}
            {geoContext.averageDistance < 5 ? 'a high density' : 
             geoContext.averageDistance < 10 ? 'a moderate density' : 'a dispersed pattern'} of 
            archaeological and historical remains in the immediate vicinity.
          </p>
        </div>
      </div>

      {/* Chronological Analysis */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building className="h-5 w-5 text-stone-600" />
          <h4 className="text-lg font-medium text-stone-800">Chronological Development</h4>
        </div>

        <div className="space-y-6">
          {chronologicalData.map(({ period, sites: periodSites }) => (
            <div key={period} className="border-l-4 border-amber-200 pl-6">
              <h5 className="text-lg font-medium text-stone-800 mb-3">{period}</h5>
              <p className="text-stone-700 mb-4">
                The {period} period is represented by <strong>{periodSites.length}</strong> recorded asset(s) 
                within the study area, indicating{' '}
                {periodSites.length > 5 ? 'significant' : 
                 periodSites.length > 2 ? 'moderate' : 'limited'} activity during this time.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {periodSites.slice(0, 4).map(site => (
                  <div key={site.id} className="bg-amber-50 rounded p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h6 className="font-medium text-stone-800">{site.name}</h6>
                        <p className="text-sm text-stone-600 mb-2">{site.description}</p>
                        <div className="flex items-center gap-4 text-xs text-stone-500">
                          <span>{site.distance.toFixed(1)}km away</span>
                          <span className="capitalize">{site.significance} significance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {periodSites.length > 4 && (
                <p className="text-sm text-stone-500 mt-2">
                  ...and {periodSites.length - 4} additional {period} assets
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Heritage Significance Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-stone-800 mb-4">Heritage Significance Assessment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['international', 'national', 'regional', 'local'].map(level => {
            const count = sites.filter(s => s.significance === level).length;
            const percentage = ((count / sites.length) * 100).toFixed(1);
            return (
              <div key={level} className="text-center">
                <div className="text-2xl font-bold text-amber-600">{count}</div>
                <div className="text-sm text-stone-600 capitalize">{level}</div>
                <div className="text-xs text-stone-500">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Archaeological Potential */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h4 className="text-lg font-medium text-stone-800 mb-4">Archaeological Potential</h4>
        <div className="prose text-stone-700">
          <p>
            Based on the density and distribution of heritage assets recorded in Historic England's National Heritage List, the study area demonstrates{' '}
            <strong>
              {sites.length > 20 ? 'high' : sites.length > 10 ? 'moderate to high' : 'moderate'}
            </strong> archaeological potential. The presence of{' '}
            {chronologicalData.length > 1 ? 'multi-period' : 'single-period'} activity suggests{' '}
            {chronologicalData.length > 3 ? 
              'continuous occupation and land use from antiquity through to the present day' :
              'focused periods of human activity and land use'}.
          </p>
          <p>
            Any proposed development within this area should consider the potential for{' '}
            {sites.some(s => s.type === 'findspot') ? 
              'previously unrecorded archaeological remains beyond those in the NHLE' :
              'additional archaeological remains associated with the designated heritage assets'}.
            Further consultation with the local Historic Environment Record (HER) is recommended for comprehensive assessment.
          </p>
        </div>
      </div>
    </div>
  );
};