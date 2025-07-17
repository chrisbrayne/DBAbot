import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface PostcodeFormProps {
  onSubmit: (postcode: string) => void;
  isLoading: boolean;
  error?: string;
}

export const PostcodeForm: React.FC<PostcodeFormProps> = ({ onSubmit, isLoading, error: externalError }) => {
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');

  const validatePostcode = (pc: string): boolean => {
    // UK postcode regex pattern
    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(pc.replace(/\s/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPostcode = postcode.trim().toUpperCase();
    
    if (!trimmedPostcode) {
      setError('Please enter a postcode');
      return;
    }

    if (!validatePostcode(trimmedPostcode)) {
      setError('Please enter a valid UK postcode (e.g., SW1A 1AA)');
      return;
    }

    setError('');
    onSubmit(trimmedPostcode);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-6 w-6 text-amber-600" />
          <h2 className="text-2xl font-semibold text-stone-800">Enter Site Location</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-stone-700 mb-2">
              UK Postcode
            </label>
            <div className="relative">
              <input
                type="text"
                id="postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g., SP4 7DE (Stonehenge)"
                className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                disabled={isLoading}
              />
              <Search className="absolute right-3 top-3 h-5 w-5 text-stone-400" />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            {externalError && (
              <p className="mt-2 text-sm text-red-600">{externalError}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 text-white py-3 px-6 rounded-md hover:bg-amber-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Querying Historic England NHLE API...
              </span>
            ) : (
              'Query Historic England Database'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-amber-50 rounded-md">
          <h3 className="text-sm font-medium text-amber-800 mb-2">Assessment Scope</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• 20km study area around postcode centroid</li>
            <li>• Live Historic England NHLE API data</li>
            <li>• Listed Buildings, Scheduled Monuments</li>
            <li>• Registered Parks & Gardens, Protected Wrecks</li>
            <li>• Registered Battlefields</li>
            <li>• Real-time data updated daily by Historic England</li>
          </ul>
        </div>
      </div>
    </div>
  );
};