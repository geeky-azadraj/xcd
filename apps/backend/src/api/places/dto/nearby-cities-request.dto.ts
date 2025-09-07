import { ApiResponse } from '@common/dto/api-response';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class NearbyCitiesRequestDto {
  @ApiProperty({ example: -27.4698 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 153.0251 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}

export class CityResult {
  @ApiProperty({ example: 'Brisbane' })
  city: string;

  @ApiProperty({ example: 'Queensland' })
  state: string;

  @ApiProperty({ example: 'Australia' })
  country: string;

  @ApiProperty({ example: -27.4698 })
  latitude: number;

  @ApiProperty({ example: 153.0251 })
  longitude: number;

  @ApiProperty({ example: 5 })
  distance: number;
}

export class NearbyCitiesResult {
  @ApiProperty({ type: CityResult })
  current_city: CityResult;

  @ApiProperty({ type: [CityResult] })
  neighboring_cities: CityResult[];
}

export class NearbyCitiesApiResponse extends ApiResponse<NearbyCitiesResult> {
  @ApiProperty({ type: () => NearbyCitiesResult })
  declare data: NearbyCitiesResult;
}
