import { ApiResponse } from '@common/dto/api-response';
import { ApiProperty } from '@nestjs/swagger';

export enum PlaceAutocompleteType {
  REGIONS = '(regions)',
  CITIES = '(cities)',
}

export class PlaceResult {
  @ApiProperty({ example: 'Sydney' })
  city: string;

  @ApiProperty({ example: 'Australia' })
  country: string;

  @ApiProperty({ example: -33.8688 })
  latitude: number;

  @ApiProperty({ example: 151.2093 })
  longitude: number;

  @ApiProperty({ example: 'Sydney' })
  suburb: string;

  @ApiProperty({ example: '2000' })
  postalCode: string;

  @ApiProperty({ example: 'NSW' })
  state: string;

  @ApiProperty({ example: '123 Main St' })
  streetAddress: string;

  @ApiProperty({ example: 'Sydney' })
  name: string;

  @ApiProperty({ example: 'Sydney' })
  formattedAddress: string;

  @ApiProperty({ example: 'ChIJN1t_tDeuEmsRUsoyG83frK4' })
  placeId: string;
}

export class AutoCompleteApiResponse extends ApiResponse<PlaceResult[]> {
  @ApiProperty({ type: () => [PlaceResult] })
  declare data?: PlaceResult[];
}

export class ReverseGeocodeApiResponse extends ApiResponse<PlaceResult> {
  @ApiProperty({ type: () => PlaceResult })
  declare data?: PlaceResult;
}
