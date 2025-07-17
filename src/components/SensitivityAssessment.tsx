import React from 'react';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import { ArchaeologicalSite } from '../types/archaeological';

interface SensitivityAssessmentProps {
  sites: ArchaeologicalSite[];
  centroid: [number, number] | null;
}

export const SensitivityAssessment: React.FC<SensitivityAssessmentProps> = ({ sites, centroid }) => {
  const calculateSensitivity = (site: ArchaeologicalSite) => {
    // High sensitivity: Scheduled Monuments within 1km
    if (site.type === 'scheduled_monument' && site.distance <= 1) return 'high';
    
    // High sensitivity: International/National significance within 2km
    if ((site.significance === 'international' || site.significance === 'national') && site.distance <= 2) return 'high';
    
    // Medium sensitivity: Non-scheduled monuments within 5km
    if (site.distance <= 5 && site.type !== 'findspot') return 'medium';
    
    // Low sensitivity: All others beyond 5km
    return 'low';
  };

  const sensitivityGroups = sites.reduce((acc, site) => {
    const sensitivity = calculateSensitivity(site);
    if (!acc[sensitivity]) acc[sensitivity] = [];
    acc[sensitivity].push(site);
    return acc;
  }, {} as Record<string, ArchaeologicalSite[]>);

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-stone-600 bg-stone-50 border-stone-200';
    }
  };

  const getSensitivityIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'medium': return <Shield className="h-5 w-5" />;
      case 'low': return <Info className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const overallSensitivity = sensitivityGroups.high?.length > 0 ? 'high' :
                            sensitivityGroups.medium?.length > 0 ? 'medium' : 'low';

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-amber-600" />
        <h3 className="text-xl font-semibold text-stone-800">Monument Sensitivity Assessment</h3>
      </div>

      {/* Overall Assessment */}
      <div className={`rounded-lg border-2 p-6 ${getSensitivityColor(overallSensitivity)}`}>
        <div className="flex items-center gap-3 mb-4">
          {getSensitivityIcon(overallSensitivity)}
          <h4 className="text-lg font-semibold">
            Overall Sensitivity: <span className="capitalize">{overallSensitivity}</span>
          </h4>
        </div>
        <p className="text-sm">
          {overallSensitivity === 'high' && 
            'The study area contains heritage assets of high sensitivity that may be significantly affected by development. Detailed assessment and mitigation measures will likely be required.'}
          {overallSensitivity === 'medium' && 
            'The study area contains heritage assets of moderate sensitivity. Careful consideration of potential impacts and appropriate mitigation measures may be required.'}
          {overallSensitivity === 'low' && 
            'The heritage assets in the study area are of lower sensitivity, though basic conservation principles should still be applied to any development proposals.'}
        </p>
      </div>

      {/* Sensitivity Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['high', 'medium', 'low'].map(level => {
          const sites = sensitivityGroups[level] || [];
          return (
            <div key={level} className={`rounded-lg border p-6 ${getSensitivityColor(level)}`}>
              <div className="flex items-center gap-3 mb-4">
                {getSensitivityIcon(level)}
                <h4 className="text-lg font-semibold capitalize">{level} Sensitivity</h4>
              </div>
              
              <div className="text-2xl font-bold mb-2">{sites.length}</div>
              <div className="text-sm mb-4">
                {sites.length === 0 ? 'No assets' :
                 sites.length === 1 ? '1 heritage asset' :
                 `${sites.length} heritage assets`}
              </div>

              {sites.length > 0 && (
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Assessment Criteria:</h5>
                  <ul className="text-xs space-y-1">
                    {level === 'high' && (
                      <>
                        <li>• Scheduled Monuments within 1km</li>
                        <li>• International/National significance within 2km</li>
                      </>
                    )}
                    {level === 'medium' && (
                      <>
                        <li>• Heritage assets within 5km</li>
                        <li>• Regional significance assets</li>
                      </>
                    )}
                    {level === 'low' && (
                      <>
                        <li>• Assets beyond 5km distance</li>
                        <li>• Local significance or findspots</li>
                      </>
                    )}
                  </ul>

                  {sites.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <h6 className="font-medium text-sm mb-2">Key Assets:</h6>
                      <div className="space-y-1">
                        {sites.slice(0, 3).map(site => (
                          <div key={site.id} className="text-xs">
                            <div className="font-medium">{site.name}</div>
                            <div className="opacity-75">{site.period} | {site.distance.toFixed(1)}km</div>
                          </div>
                        ))}
                        {sites.length > 3 && (
                          <div className="text-xs opacity-75">...and {sites.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Sensitivity Analysis */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h4 className="text-lg font-medium text-stone-800 mb-4">Detailed Sensitivity Analysis</h4>
        
        <div className="space-y-6">
          <div>
            <h5 className="font-medium text-stone-800 mb-3">Scheduled Monuments</h5>
            <p className="text-stone-700 text-sm mb-3">
              Scheduled Monuments receive the highest level of protection under the Ancient Monuments and 
              Archaeological Areas Act 1979. Any works affecting these monuments require Scheduled Monument Consent.
            </p>
            {sensitivityGroups.high?.filter(s => s.type === 'scheduled_monument').length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <div className="text-red-800 font-medium mb-2">
                  {sensitivityGroups.high.filter(s => s.type === 'scheduled_monument').length} Scheduled Monument(s) identified
                </div>
                <ul className="text-red-700 text-sm space-y-1">
                  {sensitivityGroups.high
                    .filter(s => s.type === 'scheduled_monument')
                    .slice(0, 3)
                    .map(site => (
                      <li key={site.id}>• {site.name} ({site.distance.toFixed(1)}km)</li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded p-4 text-green-700 text-sm">
                No Scheduled Monuments within high sensitivity zone (1km)
              </div>
            )}
          </div>

          <div>
            <h5 className="font-medium text-stone-800 mb-3">Listed Buildings</h5>
            <p className="text-stone-700 text-sm mb-3">
              Listed Buildings are protected under the Planning (Listed Buildings and Conservation Areas) Act 1990. 
              Settings considerations may apply where development could affect their significance.
            </p>
            <div className="bg-stone-50 border border-stone-200 rounded p-4 text-stone-700 text-sm">
              {sensitivityGroups.high?.filter(s => s.type === 'listed_building').length || 0 +
               sensitivityGroups.medium?.filter(s => s.type === 'listed_building').length || 0} Listed Building(s) 
              within medium to high sensitivity zones
            </div>
          </div>

          <div>
            <h5 className="font-medium text-stone-800 mb-3">Archaeological Potential</h5>
            <p className="text-stone-700 text-sm">
              The presence of {sites.length} recorded heritage assets within the 20km study area indicates 
              potential for previously unrecorded archaeological remains. The density of{' '}
              {(sites.length / 1256).toFixed(2)} assets per km² suggests{' '}
              {sites.length / 1256 > 0.1 ? 'high' : sites.length / 1256 > 0.05 ? 'moderate' : 'low'} archaeological potential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};