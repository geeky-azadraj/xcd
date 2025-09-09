import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsObject } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({
    description: 'Contact phone number',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({
    description: 'Customer location',
    required: false,
    example: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749],
      timezone: 'America/Los_Angeles',
      address: '123 Main St, San Francisco, CA',
    },
  })
  @IsOptional()
  @IsObject()
  location?: {
    type: string;
    coordinates: number[];
    timezone: string;
    address: string;
  };

  @ApiProperty({
    description: 'Phone country code (e.g., +1, +44, +91)',
    example: '+1',
    required: false,
  })
  @IsOptional()
  @IsString()
  countryCode?: string;
}

