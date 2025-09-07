import { EnvConfig } from '@config/env.config';
import {
  AddressComponent,
  AddressType,
  Client,
  GeocodingAddressComponentType,
  PlacesNearbyRanking,
  PlaceAutocompleteType,
} from '@googlemaps/google-maps-services-js';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PlaceResult,
} from '../dto/place-result.dto';
import { PlacesSearchProvider } from '../interface/place-search-provider';
import { REDIS_CLIENT } from '@redis/redis.provider';
import Redis from 'ioredis';
import { NearbyCitiesResult } from '../dto/nearby-cities-request.dto';
import { calculateDistance } from '@common/helpers/location.utils';
import { APP_STRINGS } from '@common/strings';

@Injectable()
export class GoogleMapsProvider implements PlacesSearchProvider {
  private readonly PlacesAPIBaseUrl =
    'https://places.googleapis.com/v1/places:autocomplete';
  private readonly googleMapsClient: Client;
  private readonly apiKey: string;
  private readonly allowedCountryCodes: string[];
  private readonly allowedCountries: string[];

  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {
    this.googleMapsClient = new Client();
    this.apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');    
    
    const supportedCountries = this.configService.get<string>('SUPPORTED_COUNTRIES');
    const allowedCountries = this.configService.get<string>('ALLOWED_COUNTRIES');

    this.allowedCountryCodes = supportedCountries ? supportedCountries.split(',') : [];
    this.allowedCountries = allowedCountries ? allowedCountries.split(',') : [];
  }

  async placesAutoComplete(
    search: string,
    types?: PlaceAutocompleteType,
  ): Promise<PlaceResult[]> {
    try {
      // Use direct REST API call instead of Google Maps client
      // Simplified approach without components filter for now
      const typesParam = types ? `&types=${types}` : '';
      
      // Ensure proper URL encoding for the search term
      const encodedSearch = encodeURIComponent(search);
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedSearch}${typesParam}&key=${this.apiKey}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      if (!data.predictions || data.predictions.length === 0) {
        return [];
      }

      const predictions = data.predictions;
      return Promise.all(
        predictions.map((prediction) => 
          this.placeDetails(prediction.place_id, types ? false : true)
        )
      );
    } catch (error) {
      throw new Error(
        APP_STRINGS.api_errors.places.provider.google_maps.google_places_api_error(
          error.message,
        ),
      );
    }
  }

  async getPlaceByAddress(address: string): Promise<PlaceResult> {
    try {
      const response = await this.googleMapsClient.geocode({
        params: {
          address,
          key: this.apiKey,
        },
      });

      if (!response.data.results.length) {
        return null;
      }

      const result = response.data.results[0];
      const placeId = result.place_id;

      if (!placeId) {
        return null;
      }

      return this.placeDetails(placeId, true);
    } catch (error) {
      // Handle specific Google Maps API errors gracefully
      if (error.message.includes('ZERO_RESULTS')) {
        return null;
      }
      throw new Error(
        APP_STRINGS.api_errors.places.provider.google_maps.google_maps_api_error(
          error.message,
        ),
      );
    }
  }

  async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<PlaceResult> {
    const response = await this.googleMapsClient.reverseGeocode({
      params: {
        latlng: `${latitude},${longitude}`,
        key: this.apiKey,
      },
    });

    return this.placeDetails(response.data.results[0].place_id, false);
  }

  async placeDetails(placeId: string, filterResult: boolean): Promise<PlaceResult | null> {
    // Temporarily disable Redis caching for testing
    // let key = `google:place-details:${placeId}`;
    // const cachedData = await this.redisClient.get(key);
    // 
    // if (cachedData) {
    //   const details = JSON.parse(cachedData);
    //   if (filterResult && (!details.postalCode || !details.state)) {
    //     return null;
    //   }
    //   return details;
    // }

    const placeDetails = await this.googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: this.apiKey,
        fields: ['name', 'address_components', 'geometry', 'formatted_address'],
      },
    });

    const result = placeDetails.data.result;

    if (!result || !result.geometry || !result.address_components) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.places.provider.google_maps.invalid_place_details_response(
          placeId,
        ),
      );
    }

    const address = result.address_components;

    const details = {
      city:
        this.findComponent(AddressType.locality, address) ||
        this.findComponent(AddressType.administrative_area_level_2, address),
      country: this.findComponentShort(AddressType.country, address), // Use short name for country
      latitude: result.geometry?.location.lat,
      longitude: result.geometry?.location.lng,
      suburb:
        this.findComponent(AddressType.sublocality, address) ||
        this.findComponent(AddressType.neighborhood, address),
      postalCode: this.findComponent(AddressType.postal_code, address),
      state: this.findComponent(
        AddressType.administrative_area_level_1,
        address,
      ),
      streetAddress: [
        this.findComponent(AddressType.street_address, address),
        this.findComponent(AddressType.route, address),
      ]
        .filter(Boolean)
        .join(' '),
      name: result.name,
      formattedAddress: result.formatted_address,
      placeId,
    };

    if (!this.allowedCountries.includes(details.country)) {
      return null;
    }

    if (filterResult && (!details.postalCode || !details.state)) {
      return null;
    }

    // Temporarily disable Redis caching
    // await this.redisClient.setex(key, 24 * 60 * 60, JSON.stringify(details));

    return details;
  }

  private findComponent(
    type: AddressType | GeocodingAddressComponentType,
    address: AddressComponent[],
  ): string {
    return (
      address.find((component) => component.types.includes(type))?.long_name ||
      ''
    );
  }

  private findComponentShort(
    type: AddressType | GeocodingAddressComponentType,
    address: AddressComponent[],
  ): string {
    return (
      address.find((component) => component.types.includes(type))?.short_name ||
      ''
    );
  }

  async getCurrentAndNearByCities(
    latitude: number,
    longitude: number,
  ): Promise<NearbyCitiesResult> {
    try {
      const key = `google:nearby-cities:${latitude},${longitude}`;
      const cachedData = await this.redisClient.get(key);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // Get current city first
      const currentCityResponse = await this.googleMapsClient.reverseGeocode({
        params: {
          latlng: `${latitude},${longitude}`,
          key: this.apiKey,
          result_type: [AddressType.locality],
        },
      });

      if (!currentCityResponse.data.results.length) {
        return { current_city: null, neighboring_cities: [] };
      }

      const currentCityResult = currentCityResponse.data.results[0];
      const currentCityDetails = {
        city: this.findComponent(
          AddressType.locality,
          currentCityResult.address_components,
        ),
        state: this.findComponent(
          AddressType.administrative_area_level_1,
          currentCityResult.address_components,
        ),
        country: this.findComponent(
          AddressType.country,
          currentCityResult.address_components,
        ),
        latitude: currentCityResult.geometry.location.lat,
        longitude: currentCityResult.geometry.location.lng,
        distance: 0,
      };

      // Get nearby cities using Places API nearbySearch with multiple types
      const nearbyResponse = await this.googleMapsClient.placesNearby({
        params: {
          location: { lat: latitude, lng: longitude },
          type: 'sublocality', // sublocality to get suburbs and districts
          key: this.apiKey,
          rankby: PlacesNearbyRanking.distance,
        },
      });

      // Get additional nearby places with locality type
      const nearbyLocalityResponse = await this.googleMapsClient.placesNearby({
        params: {
          location: { lat: latitude, lng: longitude },
          type: 'locality',
          key: this.apiKey,
          rankby: PlacesNearbyRanking.distance,
        },
      });

      // Combine and deduplicate results
      const allPlaces = [
        ...nearbyResponse.data.results,
        ...nearbyLocalityResponse.data.results,
      ];

      // Remove duplicates based on place_id
      const uniquePlaces = Array.from(
        new Map(allPlaces.map((place) => [place.place_id, place])).values(),
      );

      const neighboringCities = await Promise.all(
        uniquePlaces
          .filter(
            (place) =>
              (place.geometry &&
                place.name !== currentCityDetails.city &&
                // Ensure it's not the same location (with some tolerance)
                Math.abs(
                  place.geometry.location.lat - currentCityDetails.latitude,
                ) > 0.001) ||
              Math.abs(
                place.geometry.location.lng - currentCityDetails.longitude,
              ) > 0.001,
          )
          .map(async (place) => {
            const distance = Math.round(
              calculateDistance(
                { lat: latitude, lng: longitude },
                { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
              ),
            );

            // Get additional details for the place
            const placeDetails = await this.googleMapsClient.placeDetails({
              params: {
                place_id: place.place_id,
                key: this.apiKey,
                fields: ['address_components'],
              },
            });

            const addressComponents =
              placeDetails.data.result.address_components;

            return {
              city: place.name,
              state: this.findComponent(
                AddressType.administrative_area_level_1,
                addressComponents,
              ),
              country: this.findComponent(
                AddressType.country,
                addressComponents,
              ),
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
              distance,
            };
          }),
      );

      const result = {
        current_city: currentCityDetails,
        neighboring_cities: neighboringCities
          .filter((city) => city.distance > 0)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10), // Limit to 10 nearest cities
      };

      await this.redisClient.setex(key, 24 * 60 * 60, JSON.stringify(result));

      return result;
    } catch (error) {
      if (error.response?.data?.error_message) {
        throw new Error(
          APP_STRINGS.api_errors.places.provider.google_maps.google_maps_api_error(
            error.response.data.error_message,
          ),
        );
      }
      throw error;
    }
  }
}
