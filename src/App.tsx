import React, { useState, useEffect } from 'react';
import { PostcodeForm } from './components/PostcodeForm';
import { MapView } from './components/MapView';
import { DataTable } from './components/DataTable';
import { ReportGenerator } from './components/ReportGenerator';
import { ContextAnalysis } from './components/ContextAnalysis';
import { SensitivityAssessment } from './components/SensitivityAssessment';
import { ImpactEvaluation } from './components/ImpactEvaluation';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ArchaeologicalSite } from './types/archaeological';
import { generateMockData } from './utils/mockData';

function App() {
  const [currentPostcode, setCurrentPostcode] = useState<string>('');
  const [centroidCoords, setCentroidCoords] = useState<[number, number] | null>(null);
  const [archaeologicalSites, setArchaeologicalSites] = useState<ArchaeologicalSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'table' | 'context' | 'sensitivity' | 'impact' | 'report'>('map');

  const handlePostcodeSubmit = async (postcode: string) => {
    setIsLoading(true);
    setCurrentPostcode(postcode);
    
    try {
      // Mock geocoding - in production, this would use a real geocoding service
      const mockCoords: [number, number] = [51.1789, -1.8262]; // Stonehenge area as example
      setCentroidCoords(mockCoords);
      
      // Generate mock archaeological data
      const sites = generateMockData(mockCoords, postcode);
      setArchaeologicalSites(sites);
      
      setActiveTab('map');
    } catch (error) {
      console.error('Error processing postcode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">
            Archaeological Desk Based Assessment Tool
          </h1>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto">
            Generate comprehensive archaeological desk based assessments compliant with CIfA standards. 
            Enter a postcode to analyze heritage assets within a 20km study area.
          </p>
        </div>

        <PostcodeForm onSubmit={handlePostcodeSubmit} isLoading={isLoading} />

        {currentPostcode && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-stone-800 mb-4">
                Assessment for {currentPostcode}
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'map'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'table'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  Data Table
                </button>
                <button
                  onClick={() => setActiveTab('context')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'context'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  Context Analysis
                </button>
                <button
                  onClick={() => setActiveTab('sensitivity')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'sensitivity'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  Sensitivity Assessment
                </button>
                <button
                  onClick={() => setActiveTab('impact')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'impact'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  Impact Evaluation
                </button>
                <button
                  onClick={() => setActiveTab('report')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'report'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  Generate Report
                </button>
              </div>

              {activeTab === 'map' && centroidCoords && (
                <MapView 
                  centroid={centroidCoords} 
                  sites={archaeologicalSites}
                />
              )}

              {activeTab === 'table' && (
                <DataTable sites={archaeologicalSites} />
              )}

              {activeTab === 'context' && (
                <ContextAnalysis 
                  sites={archaeologicalSites} 
                  postcode={currentPostcode}
                />
              )}

              {activeTab === 'sensitivity' && (
                <SensitivityAssessment 
                  sites={archaeologicalSites}
                  centroid={centroidCoords}
                />
              )}

              {activeTab === 'impact' && (
                <ImpactEvaluation 
                  sites={archaeologicalSites}
                  centroid={centroidCoords}
                />
              )}

              {activeTab === 'report' && (
                <ReportGenerator 
                  postcode={currentPostcode}
                  sites={archaeologicalSites}
                  centroid={centroidCoords}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;