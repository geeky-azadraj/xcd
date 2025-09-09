import { ApiProperty } from '@nestjs/swagger';

export class CustomerMetadataItemDto {
  @ApiProperty({ description: 'Customer metadata ID' })
  id: string;

  @ApiProperty({ description: 'Company name' })
  name: string;
}

export class CustomersMetadataListResponseDto {
  @ApiProperty({ description: 'List of customers metadata', type: [CustomerMetadataItemDto] })
  customers: CustomerMetadataItemDto[];
}
