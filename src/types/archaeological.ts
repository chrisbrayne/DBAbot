export interface ArchaeologicalSite {
  id: string;
  name: string;
  period: string;
  coordinates: [number, number];
  type: 'scheduled_monument' | 'listed_building' | 'conservation_area' | 'archaeological_site' | 'findspot';
  significance: 'international' | 'national' | 'regional' | 'local';
  distance: number;
  description: string;
  designation?: string;
  reference?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  threat?: 'none' | 'low' | 'medium' | 'high';
}

export interface PostcodeData {
  postcode: string;
  centroid: [number, number];
  sites: ArchaeologicalSite[];
}

export interface AssessmentResults {
  sensitivity: 'high' | 'medium' | 'low';
  directImpacts: string[];
  indirectImpacts: string[];
  recommendations: string[];
}