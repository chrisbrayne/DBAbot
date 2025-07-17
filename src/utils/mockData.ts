import { ArchaeologicalSite } from '../types/archaeological';

export const generateMockData = (centroid: [number, number], postcode: string): ArchaeologicalSite[] => {
  const sites: ArchaeologicalSite[] = [
    {
      id: '1',
      name: 'Stonehenge',
      period: 'Neolithic',
      coordinates: [51.1789, -1.8262],
      type: 'scheduled_monument',
      significance: 'international',
      distance: 2.1,
      description: 'Prehistoric stone circle and associated monuments. One of the most famous archaeological sites in the world.',
      designation: 'Scheduled Monument',
      reference: 'SM1010140',
      condition: 'good',
      threat: 'low'
    },
    {
      id: '2',
      name: 'Durrington Walls',
      period: 'Neolithic',
      coordinates: [51.1950, -1.7950],
      type: 'scheduled_monument',
      significance: 'national',
      distance: 3.8,
      description: 'Late Neolithic henge monument, one of the largest in Britain. Associated with Stonehenge complex.',
      designation: 'Scheduled Monument',
      reference: 'SM1010141',
      condition: 'fair',
      threat: 'medium'
    },
    {
      id: '3',
      name: 'Woodhenge',
      period: 'Neolithic',
      coordinates: [51.1889, -1.7895],
      type: 'scheduled_monument',
      significance: 'national',
      distance: 4.2,
      description: 'Circular timber monument dating to the Neolithic period, now marked by concrete posts.',
      designation: 'Scheduled Monument',
      reference: 'SM1010142',
      condition: 'good',
      threat: 'low'
    },
    {
      id: '4',
      name: 'Amesbury Abbey',
      period: 'Medieval',
      coordinates: [51.1734, -1.7845],
      type: 'listed_building',
      significance: 'national',
      distance: 5.1,
      description: 'Remains of medieval Benedictine abbey, founded in the 10th century.',
      designation: 'Grade I Listed',
      reference: 'LB1234567',
      condition: 'fair',
      threat: 'medium'
    },
    {
      id: '5',
      name: 'Cursus Barrows',
      period: 'Bronze Age',
      coordinates: [51.1845, -1.8456],
      type: 'scheduled_monument',
      significance: 'national',
      distance: 1.8,
      description: 'Group of Bronze Age round barrows forming part of the Stonehenge landscape.',
      designation: 'Scheduled Monument',
      reference: 'SM1010143',
      condition: 'good',
      threat: 'low'
    },
    {
      id: '6',
      name: 'Winterbourne Stoke Crossroads Barrows',
      period: 'Bronze Age',
      coordinates: [51.1723, -1.8634],
      type: 'scheduled_monument',
      significance: 'national',
      distance: 3.4,
      description: 'Important Bronze Age barrow cemetery with various barrow types.',
      designation: 'Scheduled Monument',
      reference: 'SM1010144',
      condition: 'good',
      threat: 'low'
    },
    {
      id: '7',
      name: 'Old Sarum',
      period: 'Iron Age',
      coordinates: [51.0953, -1.8089],
      type: 'scheduled_monument',
      significance: 'national',
      distance: 12.5,
      description: 'Iron Age hillfort, later occupied by Romans, Saxons and Normans. Site of original Salisbury.',
      designation: 'Scheduled Monument',
      reference: 'SM1010145',
      condition: 'excellent',
      threat: 'none'
    },
    {
      id: '8',
      name: 'Figsbury Ring',
      period: 'Iron Age',
      coordinates: [51.1234, -1.7234],
      type: 'scheduled_monument',
      significance: 'regional',
      distance: 8.7,
      description: 'Iron Age hillfort with well-preserved earthwork defences.',
      designation: 'Scheduled Monument',
      reference: 'SM1010146',
      condition: 'good',
      threat: 'low'
    },
    {
      id: '9',
      name: 'Roman Villa Site',
      period: 'Roman',
      coordinates: [51.1567, -1.8123],
      type: 'archaeological_site',
      significance: 'regional',
      distance: 4.8,
      description: 'Remains of Roman villa complex identified through excavation and geophysical survey.',
      reference: 'HER12345',
      condition: 'unknown',
      threat: 'medium'
    },
    {
      id: '10',
      name: 'Medieval Settlement',
      period: 'Medieval',
      coordinates: [51.1678, -1.7956],
      type: 'archaeological_site',
      significance: 'local',
      distance: 6.2,
      description: 'Earthwork remains of deserted medieval village with house platforms and field systems.',
      reference: 'HER12346',
      condition: 'fair',
      threat: 'medium'
    },
    {
      id: '11',
      name: 'Prehistoric Flint Scatter',
      period: 'Mesolithic',
      coordinates: [51.1445, -1.8234],
      type: 'findspot',
      significance: 'local',
      distance: 7.3,
      description: 'Concentration of worked flint tools indicating Mesolithic activity.',
      reference: 'HER12347',
      condition: 'unknown',
      threat: 'high'
    },
    {
      id: '12',
      name: 'Post-Medieval Farmstead',
      period: 'Post Medieval',
      coordinates: [51.1823, -1.8045],
      type: 'listed_building',
      significance: 'local',
      distance: 2.9,
      description: '17th-century farmhouse and associated agricultural buildings.',
      designation: 'Grade II Listed',
      reference: 'LB1234568',
      condition: 'good',
      threat: 'low'
    },
    {
      id: '13',
      name: 'Salisbury Cathedral Close',
      period: 'Medieval',
      coordinates: [51.0640, -1.7970],
      type: 'conservation_area',
      significance: 'international',
      distance: 15.2,
      description: 'Outstanding medieval cathedral close with 13th-century cathedral and associated buildings.',
      designation: 'Conservation Area',
      reference: 'CA001',
      condition: 'excellent',
      threat: 'none'
    },
    {
      id: '14',
      name: 'Bronze Age Ring Ditch',
      period: 'Bronze Age',
      coordinates: [51.1534, -1.8345],
      type: 'archaeological_site',
      significance: 'regional',
      distance: 4.1,
      description: 'Circular crop mark indicating the position of a ploughed-out Bronze Age round barrow.',
      reference: 'HER12348',
      condition: 'poor',
      threat: 'high'
    },
    {
      id: '15',
      name: 'Roman Road',
      period: 'Roman',
      coordinates: [51.1612, -1.8167],
      type: 'archaeological_site',
      significance: 'regional',
      distance: 3.7,
      description: 'Section of Roman road visible as earthwork and confirmed by excavation.',
      reference: 'HER12349',
      condition: 'fair',
      threat: 'medium'
    }
  ];

  // Calculate actual distances from centroid (simplified calculation)
  return sites.map(site => ({
    ...site,
    distance: Math.sqrt(
      Math.pow((site.coordinates[0] - centroid[0]) * 111, 2) + 
      Math.pow((site.coordinates[1] - centroid[1]) * 111 * Math.cos(centroid[0] * Math.PI / 180), 2)
    )
  })).sort((a, b) => a.distance - b.distance);
};