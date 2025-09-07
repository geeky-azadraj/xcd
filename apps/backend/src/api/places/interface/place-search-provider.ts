import {
  PlaceResult,
} from '../dto/place-result.dto';
import { PlaceAutocompleteType } from '@googlemaps/google-maps-services-js';

export interface PlacesSearchProvider {
  placesAutoComplete(
    search: string,
    types?: PlaceAutocompleteType,
  ): Promise<PlaceResult[]>;
  placeDetails(placeId: string, filterResult: boolean): Promise<PlaceResult | null>;
  reverseGeocode(latitude: number, longitude: number): Promise<PlaceResult>;
  getPlaceByAddress(address: string): Promise<PlaceResult>;
}
