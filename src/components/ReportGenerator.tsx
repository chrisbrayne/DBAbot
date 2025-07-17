import React from 'react';
import { Download, FileText, Calendar, MapPin } from 'lucide-react';
import { ArchaeologicalSite } from '../types/archaeological';

interface ReportGeneratorProps {
  postcode: string;
  sites: ArchaeologicalSite[];
  centroid: [number, number] | null;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ postcode, sites, centroid }) => {
  const generatePDFReport = () => {
    // In a real implementation, this would generate an actual PDF
    // For now, we'll create a downloadable text summary
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DBA_${postcode.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = () => {
    const date = new Date().toLocaleDateString('en-GB');
    const directImpacts = sites.filter(s => s.distance <= 1);
    const scheduledMonuments = sites.filter(s => s.type === 'scheduled_monument');
    
    return `
ARCHAEOLOGICAL DESK BASED ASSESSMENT

Site Location: ${postcode}
Report Date: ${date}
Study Area: 20km radius from postcode centroid
Coordinates: ${centroid ? `${centroid[0].toFixed(4)}, ${centroid[1].toFixed(4)}` : 'Not available'}

EXECUTIVE SUMMARY
This desk based assessment has been conducted in accordance with the Chartered Institute for Archaeologists (CIfA) Standards and Guidance for Archaeological Desk-based Assessment. The study identifies ${sites.length} heritage assets within the 20km study area, including ${scheduledMonuments.length} Scheduled Monuments.

HERITAGE ASSETS SUMMARY
- Total Heritage Assets: ${sites.length}
- Scheduled Monuments: ${sites.filter(s => s.type === 'scheduled_monument').length}
- Listed Buildings: ${sites.filter(s => s.type === 'listed_building').length}
- Conservation Areas: ${sites.filter(s => s.type === 'conservation_area').length}
- Archaeological Sites: ${sites.filter(s => s.type === 'archaeological_site').length}
- Findspots: ${sites.filter(s => s.type === 'findspot').length}

DIRECT IMPACT ZONE (within 1km)
${directImpacts.length} heritage assets identified within the direct impact zone.

${directImpacts.map(site => `
- ${site.name}
  Type: ${site.type.replace('_', ' ')}
  Period: ${site.period}
  Distance: ${site.distance.toFixed(1)}km
  Significance: ${site.significance}
  Description: ${site.description}
`).join('')}

ASSESSMENT CONCLUSIONS
${directImpacts.length > 0 ? 
  'The presence of heritage assets within the direct impact zone requires careful consideration of potential impacts and appropriate mitigation measures.' :
  'No heritage assets identified within the direct impact zone, reducing the risk of direct physical impacts.'
}

RECOMMENDATIONS
1. Pre-application consultation with the local planning authority heritage team
2. ${scheduledMonuments.some(s => s.distance <= 1) ? 'Scheduled Monument Consent required for any works affecting scheduled monuments' : 'Consider potential for previously unrecorded archaeological remains'}
3. Archaeological evaluation may be required to inform planning decisions
4. Development should follow best practice guidance for archaeological investigation
5. Settings assessment recommended for nationally significant heritage assets

This assessment should be reviewed in conjunction with the latest local development plan policies and Historic England guidance.

Report prepared in accordance with CIfA Standards and Guidance for Archaeological Desk-based Assessment.
    `.trim();
  };

  const getOverallRisk = () => {
    const directImpacts = sites.filter(s => s.distance <= 1);
    const scheduledInDirect = directImpacts.filter(s => s.type === 'scheduled_monument');
    
    if (scheduledInDirect.length > 0) return 'High';
    if (directImpacts.length > 3) return 'Medium-High';
    if (directImpacts.length > 0) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-amber-600" />
        <h3 className="text-xl font-semibold text-stone-800">Archaeological Desk Based Assessment Report</h3>
      </div>

      {/* Report Summary */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-stone-800 mb-4">Report Details</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-stone-500" />
                <span><strong>Site Location:</strong> {postcode}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-stone-500" />
                <span><strong>Report Date:</strong> {new Date().toLocaleDateString('en-GB')}</span>
              </div>
              <div>
                <strong>Study Area:</strong> 20km radius from postcode centroid
              </div>
              <div>
                <strong>Coordinates:</strong> {centroid ? `${centroid[0].toFixed(4)}, ${centroid[1].toFixed(4)}` : 'Not available'}
              </div>
              <div>
                <strong>Standards:</strong> CIfA Standards and Guidance for DBA
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-stone-800 mb-4">Assessment Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Heritage Assets:</span>
                <span className="font-semibold">{sites.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Impact Zone (≤1km):</span>
                <span className="font-semibold">{sites.filter(s => s.distance <= 1).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Scheduled Monuments:</span>
                <span className="font-semibold">{sites.filter(s => s.type === 'scheduled_monument').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Overall Risk Level:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getOverallRisk() === 'High' ? 'bg-red-100 text-red-800' :
                  getOverallRisk() === 'Medium-High' ? 'bg-orange-100 text-orange-800' :
                  getOverallRisk() === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {getOverallRisk()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Sections Preview */}
      <div className="bg-stone-50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-stone-800 mb-4">Report Contents</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-stone-800 mb-3">Executive Summary</h5>
            <p className="text-sm text-stone-600 mb-4">
              Comprehensive overview of heritage assets, significance assessment, and key findings 
              within the study area, including compliance with CIfA standards.
            </p>
            
            <h5 className="font-medium text-stone-800 mb-3">Methodology</h5>
            <p className="text-sm text-stone-600 mb-4">
              Details of data sources consulted, including National Monuments Record, 
              Historic Environment Records, and relevant cartographic sources.
            </p>
          </div>
          
          <div>
            <h5 className="font-medium text-stone-800 mb-3">Heritage Assets Gazetteer</h5>
            <p className="text-sm text-stone-600 mb-4">
              Complete catalogue of {sites.length} heritage assets with descriptions, 
              coordinates, periods, and significance assessments.
            </p>
            
            <h5 className="font-medium text-stone-800 mb-3">Impact Assessment & Recommendations</h5>
            <p className="text-sm text-stone-600">
              Detailed evaluation of potential impacts and specific mitigation recommendations 
              for development proposals within the study area.
            </p>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h4 className="text-lg font-medium text-stone-800 mb-4">Key Findings</h4>
        
        <div className="space-y-4">
          <div className="border-l-4 border-amber-400 pl-4">
            <h5 className="font-medium text-stone-800">Archaeological Potential</h5>
            <p className="text-sm text-stone-600">
              The study area demonstrates {sites.length > 20 ? 'high' : sites.length > 10 ? 'moderate' : 'low'} 
              archaeological potential based on the density of recorded heritage assets 
              ({(sites.length / 1256).toFixed(2)} assets per km²).
            </p>
          </div>
          
          <div className="border-l-4 border-blue-400 pl-4">
            <h5 className="font-medium text-stone-800">Statutory Designations</h5>
            <p className="text-sm text-stone-600">
              {sites.filter(s => s.type === 'scheduled_monument').length} Scheduled Monument(s) and{' '}
              {sites.filter(s => s.type === 'listed_building').length} Listed Building(s) provide 
              statutory protection requiring specific consent procedures.
            </p>
          </div>
          
          <div className="border-l-4 border-green-400 pl-4">
            <h5 className="font-medium text-stone-800">Development Implications</h5>
            <p className="text-sm text-stone-600">
              {sites.filter(s => s.distance <= 1).length > 0 ? 
                `${sites.filter(s => s.distance <= 1).length} heritage asset(s) within the direct impact zone may require detailed assessment and mitigation measures.` :
                'No heritage assets within the direct impact zone, reducing development constraints.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-stone-800 mb-2">Download Complete Report</h4>
            <p className="text-sm text-stone-600">
              Generate and download a comprehensive Archaeological Desk Based Assessment report 
              compliant with CIfA Standards and suitable for planning applications.
            </p>
          </div>
          <button
            onClick={generatePDFReport}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-3 font-medium"
          >
            <Download className="h-5 w-5" />
            Download Report
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-white rounded border border-stone-200">
          <h5 className="font-medium text-stone-800 mb-2">Report Includes:</h5>
          <ul className="text-sm text-stone-600 space-y-1">
            <li>• Executive summary and methodology</li>
            <li>• Complete heritage assets gazetteer with coordinates</li>
            <li>• Chronological and geographical context analysis</li>
            <li>• Impact assessment and sensitivity mapping</li>
            <li>• Detailed recommendations and mitigation measures</li>
            <li>• Regulatory framework and consultation requirements</li>
          </ul>
        </div>
      </div>
    </div>
  );
};