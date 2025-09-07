import { AuthType } from '@common/enums/auth-type.enum';
import { ResponseUtil } from '@common/helpers/response.utils';
import { BadRequestException, Controller, Get, HttpStatus, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlacesService } from './places.service';
import {
  AutoCompleteApiResponse,
  ReverseGeocodeApiResponse,
} from './dto/place-result.dto';
import { PlaceAutocompleteType } from '@googlemaps/google-maps-services-js';
import { Throttle } from '@nestjs/throttler';
import { RouteNames } from '@common/route-names';
import { APP_STRINGS } from '@common/strings';
import { PlacesAutocompleteDto, ReverseGeocodeDto, PlaceByAddressDto } from './dto/places-query.dto';

@Controller(RouteNames.PLACES)
@ApiTags('Places')
@UsePipes(new ValidationPipe({ 
  whitelist: false, 
  forbidNonWhitelisted: false,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}))
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  // TODO: Should be updated in production environment
  @Throttle({ short: { limit: 100, ttl: 60 * 1000 } })
  @Get()
  @ApiQuery({ name: 'search', required: true, type: String })
  @ApiQuery({ name: 'types', required: false, enum: PlaceAutocompleteType })
  @ApiOperation({ summary: 'Places autocomplete with location details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Places fetched successfully',
    type: AutoCompleteApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async placesAutoComplete(
    @Query() query: PlacesAutocompleteDto,
  ): Promise<AutoCompleteApiResponse> {
    if (!query.search || query.search.trim().length === 0) {
      throw new BadRequestException('Search parameter is required and cannot be empty');
    }
    
    let decodedSearch: string;
    try {
      decodedSearch = decodeURIComponent(query.search);
      if (decodedSearch !== query.search && decodedSearch.includes('%')) {
        decodedSearch = decodeURIComponent(decodedSearch);
      }
    } catch (error) {
      decodedSearch = query.search;
    }
    
    if (!decodedSearch || decodedSearch.trim().length === 0) {
      throw new BadRequestException('Search parameter is required and cannot be empty after decoding');
    }
    
    const problematicChars = /[<>]/;
    if (problematicChars.test(decodedSearch)) {
      throw new BadRequestException('Search parameter contains invalid characters');
    }
    
    if (decodedSearch.length > 255) {
      throw new BadRequestException('Search parameter is too long. Maximum length is 255 characters');
    }
    
    const data = await this.placesService.placesAutoComplete(decodedSearch, query.types);
    return ResponseUtil.success(
      data,
      APP_STRINGS.api_responses.places.places_fetched_successfully,
      HttpStatus.OK,
    );
  }

  @Get(RouteNames.PLACES_REVERSE_GEOCODE)
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiOperation({ summary: 'Reverse geocode with location details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reverse geocode fetched successfully',
    type: ReverseGeocodeApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid coordinates provided',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async reverseGeocode(
    @Query() query: ReverseGeocodeDto,
  ): Promise<ReverseGeocodeApiResponse> {
    if (query.latitude === undefined || query.longitude === undefined) {
      throw new BadRequestException('Latitude and longitude parameters are required');
    }
    
    const lat = parseFloat(query.latitude.toString());
    const lng = parseFloat(query.longitude.toString());
    
    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Latitude and longitude must be valid numbers');
    }
    
    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }
    
    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
    }
    
    const data = await this.placesService.reverseGeocode(lat, lng);
    return ResponseUtil.success(
      data,
      APP_STRINGS.api_responses.places.reverse_geocode_fetched_successfully,
      HttpStatus.OK,
    );
  }

  @Get(RouteNames.PLACES_PLACE_BY_ADDRESS)
  @ApiQuery({ name: 'address', required: true, type: String })
  @ApiOperation({ summary: 'Get place by address' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Place fetched successfully',
    type: ReverseGeocodeApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid address provided',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getPlaceByAddress(
    @Query() query: PlaceByAddressDto,
  ): Promise<ReverseGeocodeApiResponse> {
    if (!query.address || query.address.trim().length === 0) {
      throw new BadRequestException('Address parameter is required and cannot be empty');
    }
    
    let decodedAddress: string;
    try {
      decodedAddress = decodeURIComponent(query.address);
      if (decodedAddress !== query.address && decodedAddress.includes('%')) {
        decodedAddress = decodeURIComponent(decodedAddress);
      }
    } catch (error) {
      decodedAddress = query.address;
    }
    
    if (!decodedAddress || decodedAddress.trim().length === 0) {
      throw new BadRequestException('Address parameter is required and cannot be empty after decoding');
    }
    
    const problematicChars = /[<>]/;
    if (problematicChars.test(decodedAddress)) {
      throw new BadRequestException('Address parameter contains invalid characters');
    }
    
    if (decodedAddress.length > 255) {
      throw new BadRequestException('Address parameter is too long. Maximum length is 255 characters');
    }
    
    const data = await this.placesService.getPlaceByAddress(decodedAddress);
    return ResponseUtil.success(
      data,
      APP_STRINGS.api_responses.places.place_fetched_successfully,
      HttpStatus.OK,
    );
  }
}
