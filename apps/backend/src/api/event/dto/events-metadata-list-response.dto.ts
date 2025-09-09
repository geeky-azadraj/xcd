import { ApiProperty } from '@nestjs/swagger';

export class EventMetadataItemDto {
  @ApiProperty({ description: 'Event metadata ID' })
  id: string;

  @ApiProperty({ description: 'Event name' })
  name: string;
}

export class EventsMetadataListResponseDto {
  @ApiProperty({ description: 'List of events metadata', type: [EventMetadataItemDto] })
  events: EventMetadataItemDto[];
}
