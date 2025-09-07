import { Inject, Injectable } from '@nestjs/common';
import { PlacesSearchProvider } from './interface/place-search-provider';
import {
  PlaceResult,
} from './dto/place-result.dto';
import { PlaceAutocompleteType } from '@googlemaps/google-maps-services-js';

@Injectable()
export class PlacesService {
  constructor(
    @Inject('PlacesSearchProvider')
    private readonly placesSearchProvider: PlacesSearchProvider,
  ) {}

  async placesAutoComplete(
    search: string,
    types?: PlaceAutocompleteType,
  ): Promise<PlaceResult[]> {
    const places = await this.placesSearchProvider.placesAutoComplete(
      search,
      types,
    );
    return places.filter(Boolean);
  }

  async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<PlaceResult> {
    return await this.placesSearchProvider.reverseGeocode(latitude, longitude);
  }

  async getPlaceByAddress(address: string): Promise<PlaceResult> {
    return await this.placesSearchProvider.getPlaceByAddress(address);
  }
}
