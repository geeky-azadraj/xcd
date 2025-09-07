import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class EventFilters {
  @ApiPropertyOptional({ description: 'Filter by event status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by exact created date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateAdded?: string;

  @ApiPropertyOptional({ description: 'Filter by exact last modified date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  lastModified?: string;

  @ApiPropertyOptional({ description: 'Only upcoming events'})
  @IsOptional()
  @IsString()
  upcoming?: string;
  
  @ApiPropertyOptional({ description: 'Search by event name' })
  @IsOptional()
  @IsString()
  search?: string;
}