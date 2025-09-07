import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class EventStatusParamDto {
  @ApiProperty({ 
    description: 'Status to filter events by', 
    enum: ['active', 'inactive'] 
  })
  @IsEnum(['active', 'inactive'])
  status: 'active' | 'inactive';
}
