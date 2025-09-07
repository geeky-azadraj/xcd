import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerResponseDto } from '@api/customer/dto/customer-response.dto';

export class PaginationDto {
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
}

export class PaginationDetailsDto {
  @ApiProperty({ description: 'Current page number' })
  @IsNumber()
  pageNo: number;

  @ApiProperty({ description: 'Number of items per page' })
  @IsNumber()
  pageSize: number;

  @ApiProperty({ description: 'Total number of items available' })
  @IsNumber()
  totalCount: number;

  @ApiProperty({ description: 'Total number of pages available' })
  @IsNumber()
  totalPages: number;
}

export class CustomerListResponseDto {
  @ApiProperty({ type: [CustomerResponseDto] })
  data: CustomerResponseDto[];

  @ApiProperty({ type: PaginationDetailsDto })
  pagination: PaginationDetailsDto;
}
