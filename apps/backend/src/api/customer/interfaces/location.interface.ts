export interface LocationCoordinates {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface LocationAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  unit?: string;
}

export interface CustomerLocation {
  type: string;
  coordinates: number[];
  timezone: string;
  address: string;
}

// Helper function to validate location structure
export function isValidLocation(location: any): location is CustomerLocation {
  if (!location || typeof location !== 'object') {
    return false;
  }

  // Check required fields
  if (!location.type || !location.coordinates || !location.timezone || !location.address) {
    return false;
  }

  // Validate coordinates array
  if (!Array.isArray(location.coordinates) || 
      location.coordinates.length !== 2 ||
      typeof location.coordinates[0] !== 'number' ||
      typeof location.coordinates[1] !== 'number') {
    return false;
  }

  // Validate string fields
  if (typeof location.type !== 'string' || 
      typeof location.timezone !== 'string' || 
      typeof location.address !== 'string') {
    return false;
  }

  return true;
}

