import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { PlaceAutocompleteType } from '@googlemaps/google-maps-services-js';

export class PlacesAutocompleteDto {
  @ApiProperty({
    description: 'Search term for places',
    example: 'London',
  })
  @IsString()
  search: string;

  @ApiProperty({
    description: 'Filter by place type',
    enum: PlaceAutocompleteType,
    required: false,
    example: '(cities)',
  })
  @IsOptional()
  @IsString()
  types?: PlaceAutocompleteType;
}

export class ReverseGeocodeDto {
  @ApiProperty({
    description: 'Latitude coordinate (-90 to 90)',
    example: 40.7128,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate (-180 to 180)',
    example: -74.0060,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class PlaceByAddressDto {
  @ApiProperty({
    description: 'Full address string',
    example: '1600 Pennsylvania Avenue NW, Washington, DC',
  })
  @IsString()
  address: string;
}
