import React from 'react';
import { Landmark, Menu } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-stone-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Landmark className="h-8 w-8 text-amber-600" />
            <div>
              <h1 className="text-xl font-bold text-stone-800">Heritage Assessment Tool</h1>
              <p className="text-xs text-stone-500">Archaeological Desk Based Assessment</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-stone-600 hover:text-stone-800 transition-colors">Documentation</a>
            <a href="#" className="text-stone-600 hover:text-stone-800 transition-colors">API Access</a>
            <a href="#" className="text-stone-600 hover:text-stone-800 transition-colors">Support</a>
          </div>
          
          <button className="md:hidden">
            <Menu className="h-6 w-6 text-stone-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};