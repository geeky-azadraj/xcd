import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleStatusDto {
  @ApiProperty({
    description: 'Whether to enable (true) or disable (false) the customer',
    example: true,
  })
  @IsBoolean()
  enable: boolean;
}

