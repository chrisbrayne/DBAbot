import React from 'react';
import { Target, AlertCircle, CheckCircle } from 'lucide-react';
import { ArchaeologicalSite } from '../types/archaeological';

interface ImpactEvaluationProps {
  sites: ArchaeologicalSite[];
  centroid: [number, number] | null;
}

export const ImpactEvaluation: React.FC<ImpactEvaluationProps> = ({ sites, centroid }) => {
  const directImpactSites = sites.filter(site => site.distance <= 1);
  const indirectImpactSites = sites.filter(site => site.distance > 1 && site.distance <= 20);

  const getImpactLevel = (site: ArchaeologicalSite) => {
    if (site.distance <= 0.5) return 'high';
    if (site.distance <= 1) return 'medium';
    if (site.distance <= 5) return 'low-medium';
    return 'low';
  };

  const generateRecommendations = () => {
    const recommendations = [];
    
    if (directImpactSites.some(s => s.type === 'scheduled_monument')) {
      recommendations.push('Scheduled Monument Consent will be required for any works affecting scheduled monuments');
    }
    
    if (directImpactSites.some(s => s.type === 'listed_building')) {
      recommendations.push('Listed Building Consent may be required; heritage impact assessment recommended');
    }
    
    if (directImpactSites.length > 0) {
      recommendations.push('Pre-application consultation with the local planning authority heritage team is advised');
      recommendations.push('Archaeological evaluation may be required to inform planning decisions');
    }
    
    if (indirectImpactSites.some(s => s.significance === 'international' || s.significance === 'national')) {
      recommendations.push('Settings assessment required for nationally significant heritage assets');
    }
    
    recommendations.push('Development should follow best practice guidance for archaeological investigation');
    
    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Target className="h-6 w-6 text-amber-600" />
        <h3 className="text-xl font-semibold text-stone-800">Impact Evaluation</h3>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h4 className="text-lg font-medium text-stone-800">Direct Impacts</h4>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{directImpactSites.length}</div>
          <p className="text-sm text-stone-600 mb-4">Heritage assets within 1km (direct impact zone)</p>
          
          {directImpactSites.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-stone-800 mb-2">Potential Impacts:</div>
                <ul className="space-y-1 text-stone-600">
                  <li>• Physical disturbance to archaeological deposits</li>
                  <li>• Changes to setting and visual context</li>
                  <li>• Noise, dust, and vibration during construction</li>
                  <li>• Permanent alteration of landscape character</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">No direct impact concerns identified</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <h4 className="text-lg font-medium text-stone-800">Indirect Impacts</h4>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">{indirectImpactSites.length}</div>
          <p className="text-sm text-stone-600 mb-4">Heritage assets within 1-20km (indirect impact zone)</p>
          
          <div className="space-y-3">
            <div className="text-sm">
              <div className="font-medium text-stone-800 mb-2">Potential Impacts:</div>
              <ul className="space-y-1 text-stone-600">
                <li>• Changes to wider landscape setting</li>
                <li>• Visual impact on heritage asset significance</li>
                <li>• Cumulative effects with other developments</li>
                <li>• Impact on understanding and appreciation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Impact Analysis */}
      {directImpactSites.length > 0 && (
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h4 className="text-lg font-medium text-red-800 mb-4">Direct Impact Analysis</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-200">
                  <th className="text-left py-2 text-red-800 font-medium">Heritage Asset</th>
                  <th className="text-left py-2 text-red-800 font-medium">Type</th>
                  <th className="text-left py-2 text-red-800 font-medium">Distance</th>
                  <th className="text-left py-2 text-red-800 font-medium">Impact Level</th>
                  <th className="text-left py-2 text-red-800 font-medium">Primary Concerns</th>
                </tr>
              </thead>
              <tbody>
                {directImpactSites.map(site => (
                  <tr key={site.id} className="border-b border-red-100">
                    <td className="py-3">
                      <div className="font-medium text-red-900">{site.name}</div>
                      <div className="text-sm text-red-700">{site.period}</div>
                    </td>
                    <td className="py-3 text-red-800 capitalize">{site.type.replace('_', ' ')}</td>
                    <td className="py-3 text-red-800">{site.distance.toFixed(1)}km</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getImpactLevel(site) === 'high' ? 'bg-red-200 text-red-800' :
                        getImpactLevel(site) === 'medium' ? 'bg-orange-200 text-orange-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {getImpactLevel(site)}
                      </span>
                    </td>
                    <td className="py-3 text-red-800 text-sm">
                      {site.type === 'scheduled_monument' && 'Statutory protection, consent required'}
                      {site.type === 'listed_building' && 'Setting impact, visual changes'}
                      {site.type === 'archaeological_site' && 'Potential subsurface remains'}
                      {site.type === 'conservation_area' && 'Character and appearance'}
                      {site.type === 'findspot' && 'Archaeological potential'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Significance Categories Impact */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h4 className="text-lg font-medium text-stone-800 mb-4">Impact by Heritage Significance</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['international', 'national', 'regional', 'local'].map(level => {
            const affectedSites = sites.filter(s => s.significance === level && s.distance <= 5);
            const isHighConcern = level === 'international' || level === 'national';
            
            return (
              <div key={level} className={`rounded-lg border p-4 ${
                isHighConcern && affectedSites.length > 0 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isHighConcern && affectedSites.length > 0 ? 'text-red-600' : 'text-stone-600'
                  }`}>
                    {affectedSites.length}
                  </div>
                  <div className="text-sm text-stone-600 capitalize mb-2">{level}</div>
                  <div className="text-xs text-stone-500">
                    within 5km impact zone
                  </div>
                  
                  {isHighConcern && affectedSites.length > 0 && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      High priority assessment required
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
        <h4 className="text-lg font-medium text-amber-800 mb-4">Mitigation Recommendations</h4>
        
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="text-amber-800">{recommendation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Framework */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h4 className="text-lg font-medium text-stone-800 mb-4">Relevant Legislation and Guidance</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-stone-800 mb-3">Statutory Protection</h5>
            <ul className="space-y-2 text-sm text-stone-700">
              <li>• Ancient Monuments and Archaeological Areas Act 1979</li>
              <li>• Planning (Listed Buildings and Conservation Areas) Act 1990</li>
              <li>• National Planning Policy Framework (NPPF)</li>
              <li>• Planning Practice Guidance on Historic Environment</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-stone-800 mb-3">Professional Standards</h5>
            <ul className="space-y-2 text-sm text-stone-700">
              <li>• CIfA Standards and Guidance for Desk-based Assessment</li>
              <li>• Historic England Good Practice Guidance</li>
              <li>• Local Planning Authority Archaeological Briefs</li>
              <li>• Regional Research Framework Priorities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};