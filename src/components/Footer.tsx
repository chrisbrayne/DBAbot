import React from 'react';
import { Landmark, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-800 text-stone-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Landmark className="h-8 w-8 text-amber-400" />
              <div>
                <h3 className="text-xl font-bold">Heritage Assessment Tool</h3>
                <p className="text-stone-400 text-sm">Archaeological Desk Based Assessment</p>
              </div>
            </div>
            <p className="text-stone-300 mb-4 max-w-md">
              Professional archaeological desk based assessment tool compliant with CIfA Standards 
              and Local Planning Authority requirements. Supporting heritage professionals in 
              development planning and archaeological evaluation using Historic England's National Heritage List.
            </p>
            <p className="text-xs text-stone-400">
              Built with data from Historic England's National Heritage List for England (NHLE) and local Historic Environment Records
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Standards & Guidance</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  CIfA Standards
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  Historic England
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  NPPF Guidance
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  Planning Portal
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Data Sources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://historicengland.org.uk/listing/the-list/" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  Historic England NHLE
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://www.heritagegateway.org.uk/" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  Heritage Gateway
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://www.pastscape.org.uk/" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  PastScape
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://opendata-historicengland.hub.arcgis.com/" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  HE Open Data Hub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://www.archaeologists.net/work/standards" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  Local HERs
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-700 mt-8 pt-8 text-center text-xs text-stone-400">
          <p>
            © 2025 Heritage Assessment Tool. This tool is designed to support archaeological professionals 
            and should be used in conjunction with professional expertise, local Historic Environment Records, and local authority guidance.
            Data sourced from Historic England's National Heritage List for England under Open Government Licence.
          </p>
        </div>
      </div>
    </footer>
  );
};