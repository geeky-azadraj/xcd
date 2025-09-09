import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerListQueryDto {
  @ApiProperty({ description: 'Current page number', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Number of items per page', default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ 
    description: 'Search term for customer name or email', 
    required: false,
    example: 'john'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    description: 'Filter by customer status', 
    required: false,
    enum: ['active', 'inactive', 'deleted'],
    example: 'active'
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'deleted'])
  status?: string;

  @ApiProperty({ 
    description: 'Sort by field', 
    required: false,
    enum: ['created_date', 'customer_name', 'contact_email'],
    example: 'created_date'
  })
  @IsOptional()
  @IsIn(['created_date', 'customer_name', 'contact_email'])
  sortBy?: string = 'created_date';

  @ApiProperty({ 
    description: 'Sort order', 
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc'
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string = 'desc';
}
