import proj4 from 'proj4';

// Define coordinate systems
const bng = '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs';
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';

// Configure proj4 for coordinate conversion
proj4.defs('EPSG:27700', bng);
proj4.defs('EPSG:4326', wgs84);

export interface NHLERecord {
  attributes: {
    OBJECTID?: number;
    ListEntry?: number;
    Name?: string;
    Grade?: string;
    ListDate?: string;
    AmendDate?: string;
    LegacyUID?: string;
    Location?: string;
    District?: string;
    County?: string;
    Parish?: string;
    NGR?: string;
    Easting?: number;
    Northing?: number;
    Hyperlink?: string;
    HeritageCategory?: string;
    ScheduledMonumentNumber?: string;
    PeriodFrom?: string;
    PeriodTo?: string;
    CuratedDescription?: string;
    POINT_X?: number;
    POINT_Y?: number;
    X?: number;
    Y?: number;
    SHAPE_X?: number;
    SHAPE_Y?: number;
  };
  geometry?: {
    x: number;
    y: number;
  };
}

export interface PostcodeGeocoding {
  lat: number;
  lng: number;
  postcode: string;
}

export class HistoricEnglandService {
  private readonly postcodeApiUrl = 'https://api.postcodes.io/postcodes';
  private readonly nhleServiceUrl = 'https://services-eu1.arcgis.com/ZOdPfBS3aqqDYPUQ/arcgis/rest/services/National_Heritage_List_for_England_NHLE_v02_VIEW/FeatureServer/6';

  /**
   * Geocode a UK postcode to WGS84 coordinates
   */
  async geocodePostcode(postcode: string): Promise<PostcodeGeocoding> {
    try {
      console.log(`Geocoding postcode: ${postcode}`);
      const response = await fetch(`${this.postcodeApiUrl}/${encodeURIComponent(postcode)}`);
      
      if (!response.ok) {
        throw new Error(`Postcode not found: ${postcode}`);
      }

      const data = await response.json();
      console.log('Geocoding result:', data.result);
      
      return {
        lat: data.result.latitude,
        lng: data.result.longitude,
        postcode: data.result.postcode
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error(`Failed to geocode postcode: ${postcode}`);
    }
  }

  /**
   * Convert WGS84 coordinates to British National Grid
   */
  private wgs84ToBng(lat: number, lng: number): { easting: number; northing: number } {
    const [easting, northing] = proj4('EPSG:4326', 'EPSG:27700', [lng, lat]);
    return { easting, northing };
  }

  /**
   * Convert British National Grid coordinates to WGS84
   */
  private bngToWgs84(easting: number, northing: number): { lat: number; lng: number } {
    const [lng, lat] = proj4('EPSG:27700', 'EPSG:4326', [easting, northing]);
    return { lat, lng };
  }

  /**
   * Calculate distance between two points in kilometers
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Query Historic England NHLE dataset for heritage assets within buffer
   */
  async queryHeritageAssets(centroidLat: number, centroidLng: number, bufferKm: number = 20): Promise<NHLERecord[]> {
    try {
      console.log(`Querying NHLE for coordinates: ${centroidLat}, ${centroidLng} with ${bufferKm}km buffer`);

      // Convert centroid to BNG for spatial query
      const { easting, northing } = this.wgs84ToBng(centroidLat, centroidLng);
      const bufferMeters = bufferKm * 1000;

      console.log(`Converted to BNG: ${easting}, ${northing} with ${bufferMeters}m buffer`);

      // Create envelope geometry for spatial query
      const envelope = {
        xmin: easting - bufferMeters,
        ymin: northing - bufferMeters,
        xmax: easting + bufferMeters,
        ymax: northing + bufferMeters,
        spatialReference: { wkid: 27700 }
      };

      // Query parameters for ArcGIS REST API
      const params = new URLSearchParams({
        f: 'json',
        where: '1=1',
        outFields: '*',
        geometry: JSON.stringify(envelope),
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: 'true',
        maxRecordCount: '2000',
        resultOffset: '0'
      });

      const queryUrl = `${this.nhleServiceUrl}/query?${params.toString()}`;
      console.log(`Querying NHLE API: ${queryUrl}`);

      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        console.error(`NHLE API returned ${response.status}: ${response.statusText}`);
        throw new Error(`NHLE API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('NHLE API response:', data);

      if (data.error) {
        console.error('NHLE API error:', data.error);
        throw new Error(`NHLE API error: ${data.error.message || 'Unknown error'}`);
      }

      if (!data.features || !Array.isArray(data.features)) {
        console.warn('No features found in NHLE response');
        return [];
      }

      console.log(`Found ${data.features.length} features from NHLE API`);

      // Filter records within actual circular buffer and add distance
      const filteredRecords = data.features.filter((record: NHLERecord) => {
        // Try different geometry field names
        const geometry = record.geometry;
        const attrs = record.attributes;
        let x, y;

        if (geometry && geometry.x && geometry.y) {
          x = geometry.x;
          y = geometry.y;
        } else if (attrs.POINT_X && attrs.POINT_Y) {
          x = attrs.POINT_X;
          y = attrs.POINT_Y;
        } else if (attrs.X && attrs.Y) {
          x = attrs.X;
          y = attrs.Y;
        } else if (attrs.SHAPE_X && attrs.SHAPE_Y) {
          x = attrs.SHAPE_X;
          y = attrs.SHAPE_Y;
        } else if (attrs.Easting && attrs.Northing) {
          x = attrs.Easting;
          y = attrs.Northing;
        } else {
          console.warn('No valid coordinates found for record:', record);
          return false;
        }

        try {
          // Convert record coordinates to WGS84
          const { lat, lng } = this.bngToWgs84(x, y);
          const distance = this.calculateDistance(centroidLat, centroidLng, lat, lng);
          
          // Add calculated distance and coordinates to record
          (record as any).calculatedDistance = distance;
          (record as any).wgs84Coordinates = { lat, lng };

          return distance <= bufferKm;
        } catch (error) {
          console.warn('Error processing coordinates for record:', record, error);
          return false;
        }
      });

      console.log(`Filtered records within ${bufferKm}km: ${filteredRecords.length}`);
      return filteredRecords;

    } catch (error) {
      console.error('Error querying NHLE heritage assets:', error);
      throw new Error(`Failed to retrieve heritage assets from Historic England: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert NHLE records to application format
   */
  convertToArchaeologicalSites(records: NHLERecord[], centroidLat: number, centroidLng: number): any[] {
    return records.map((record, index) => {
      const attrs = record.attributes;
      const distance = (record as any).calculatedDistance || 0;
      const coords = (record as any).wgs84Coordinates || { lat: 0, lng: 0 };

      // Determine site type based on heritage category or grade
      let type = 'archaeological_site';
      const category = attrs.HeritageCategory?.toLowerCase() || '';
      
      if (category.includes('scheduled') || attrs.ScheduledMonumentNumber) {
        type = 'scheduled_monument';
      } else if (attrs.Grade) {
        type = 'listed_building';
      } else if (category.includes('park') || category.includes('garden')) {
        type = 'conservation_area';
      } else if (category.includes('wreck')) {
        type = 'archaeological_site';
      } else if (category.includes('battlefield')) {
        type = 'archaeological_site';
      }

      // Determine significance based on grade/designation
      let significance = 'local';
      if (attrs.Grade === 'I' || attrs.Grade === '1' || category.includes('scheduled')) {
        significance = 'national';
      } else if (attrs.Grade === 'II*' || attrs.Grade === '2*') {
        significance = 'regional';
      } else if (attrs.Grade === 'II' || attrs.Grade === '2') {
        significance = 'local';
      } else if (category.includes('international')) {
        significance = 'international';
      }

      // Extract period information
      const period = attrs.PeriodFrom || 
                    this.extractPeriodFromDescription(attrs.CuratedDescription || attrs.Name || '') || 
                    'Unknown';

      // Create designation string
      let designation = 'Heritage Asset';
      if (attrs.Grade) {
        designation = `Grade ${attrs.Grade} Listed Building`;
      } else if (attrs.ScheduledMonumentNumber) {
        designation = 'Scheduled Monument';
      } else if (attrs.HeritageCategory) {
        designation = attrs.HeritageCategory;
      }

      return {
        id: `nhle_${attrs.ListEntry || attrs.OBJECTID || index}`,
        name: attrs.Name || 'Unnamed Heritage Asset',
        period: period,
        coordinates: [coords.lat, coords.lng] as [number, number],
        type: type,
        significance: significance,
        distance: distance,
        description: attrs.CuratedDescription || attrs.Location || 'Historic England listed heritage asset',
        designation: designation,
        reference: attrs.ListEntry ? `NHLE ${attrs.ListEntry}` : undefined,
        condition: 'unknown' as const,
        threat: distance < 1 ? 'high' : distance < 5 ? 'medium' : 'low' as const,
        hyperlink: attrs.Hyperlink,
        county: attrs.County,
        district: attrs.District,
        parish: attrs.Parish,
        ngr: attrs.NGR
      };
    }).sort((a, b) => a.distance - b.distance);
  }

  /**
   * Extract period information from description text
   */
  private extractPeriodFromDescription(text: string): string | null {
    const periods = [
      'Palaeolithic', 'Mesolithic', 'Neolithic', 'Bronze Age', 'Iron Age',
      'Roman', 'Early Medieval', 'Medieval', 'Post Medieval', 'Modern',
      'Saxon', 'Norman', 'Tudor', 'Stuart', 'Georgian', 'Victorian', 'Edwardian'
    ];

    const lowerText = text.toLowerCase();
    
    for (const period of periods) {
      if (lowerText.includes(period.toLowerCase())) {
        return period;
      }
    }

    // Try to extract century information
    const centuryMatch = text.match(/(\d{1,2})(th|st|nd|rd)\s*century/i);
    if (centuryMatch) {
      const century = parseInt(centuryMatch[1]);
      if (century <= 5) return 'Early Medieval';
      if (century <= 11) return 'Medieval';
      if (century <= 16) return 'Post Medieval';
      return 'Modern';
    }

    return null;
  }
}

export const historicEnglandService = new HistoricEnglandService();