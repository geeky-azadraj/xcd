import { ApiProperty } from '@nestjs/swagger';
import { CustomerLocation } from '../interfaces/location.interface';

export class CustomerResponseDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  id: string;

  @ApiProperty({
    description: 'XCD Customer user ID',
    example: 1,
  })
  userId: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  customerName: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'john.doe@example.com',
  })
  contactEmail: string;

  @ApiProperty({
    description: 'Contact phone number',
    required: false,
    example: '+1234567890',
  })
  contactPhone?: string;

  @ApiProperty({
    description: 'Company ID',
    example: 1,
  })
  companyId: string;

  @ApiProperty({
    description: 'Company name',
    required: false,
    example: 'Acme Corp',
  })
  companyName?: string;

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
  location?: CustomerLocation;

  @ApiProperty({
    description: 'Customer status',
    enum: ['active', 'inactive', 'deleted'],
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Total events count',
    example: 0,
  })
  totalEvents: number;

  @ApiProperty({
    description: 'Created by user ID',
    example: 1,
  })
  createdBy: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

