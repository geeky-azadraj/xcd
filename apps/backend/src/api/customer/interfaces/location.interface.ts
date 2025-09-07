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
  type?: 'Point' | 'Address' | 'Custom';
  coordinates?: [number, number];
  address?: LocationAddress;
  custom?: Record<string, any>;
  timezone?: string;
  formatted?: string; // Human-readable formatted address
}

// Helper function to validate location structure
export function isValidLocation(location: any): location is CustomerLocation {
  if (!location || typeof location !== 'object') {
    return false;
  }

  // If coordinates are provided, they must be valid
  if (location.coordinates) {
    if (!Array.isArray(location.coordinates) || 
        location.coordinates.length !== 2 ||
        typeof location.coordinates[0] !== 'number' ||
        typeof location.coordinates[1] !== 'number') {
      return false;
    }
  }

  // If address is provided, it must be an object
  if (location.address && typeof location.address !== 'object') {
    return false;
  }

  return true;
}

