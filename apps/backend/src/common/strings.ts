export const APP_STRINGS = {
  PLACES: {
    INVALID_COORDINATES: 'Invalid coordinates provided',
    INVALID_ADDRESS: 'Invalid address provided',
    NO_RESULTS_FOUND: 'No results found for the given criteria',
    API_ERROR: 'Error occurred while fetching place data',
    UNSUPPORTED_COUNTRY: 'This country is not supported',
    INVALID_COUNTRY_CODE: 'Invalid country code provided',
  },
  COMMON: {
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
  },
  api_responses: {
    places: {
      places_fetched_successfully: 'Places fetched successfully',
      reverse_geocode_fetched_successfully: 'Reverse geocode fetched successfully',
      place_fetched_successfully: 'Place fetched successfully',
    },
  },
  api_errors: {
    places: {
      provider: {
        google_maps: {
          google_places_api_error: (error: string) => `Google Places API error: ${error}`,
          invalid_place_details_response: (placeId: string) => `Invalid place details response for place ID: ${placeId}`,
          google_maps_api_error: (error: string) => `Google Maps API error: ${error}`,
        },
      },
    },
  },
} as const;
