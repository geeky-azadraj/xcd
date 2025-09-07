import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber, IsIn, IsObject, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerLocation } from '../interfaces/location.interface';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'XCD Customer user ID',
    example: "b9cc7613-5e0f-4d22-923e-4a10d7dc251e",
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsString()
  customerName: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({
    description: 'Contact phone number',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.contactPhone !== undefined)
  contactPhone?: string;

  @ApiProperty({
    description: 'Company ID',
    example: "b9cc7613-5e0f-4d22-923e-4a10d7dc251e",
  })
  @IsString()
  companyId: string;

  @ApiProperty({
    description: 'Company name',
    required: false,
    example: 'Acme Corp',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    description: 'Customer location',
    required: false,
    example: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749],
      timezone: 'America/Los_Angeles',
      address: ['123 Main St, San Francisco, CA'],
    },
  })
  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.location !== undefined)
  location?: CustomerLocation;

  @ApiProperty({
    description: 'Customer status',
    enum: ['active', 'inactive', 'deleted'],
    default: 'active',
    example: 'active',
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'deleted'])
  status?: string;

  @ApiProperty({
    description: 'Total events count',
    required: false,
    default: 0,
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  totalEvents?: number;
}


