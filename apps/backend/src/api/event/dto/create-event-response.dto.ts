import { ApiProperty } from '@nestjs/swagger';

export class CreateEventResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;
}
