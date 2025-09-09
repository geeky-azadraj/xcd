import { ApiProperty } from '@nestjs/swagger';

export class EventListItemDto {
  @ApiProperty({ description: 'Id of the event', format: 'string'})
  id: string;
  
  @ApiProperty({ description: 'Event logo URL', format: 'uri' })
  eventLogo: string;

  @ApiProperty({ description: 'Name of the event' })
  eventName: string;

  @ApiProperty({ description: 'Type of the event' })
  eventType: string;

  @ApiProperty({ description: 'Start date of the event', format: 'date' })
  eventStartDate: string;

  @ApiProperty({ description: 'End date of the event', format: 'date' })
  eventEndDate: string;

  @ApiProperty({ description: 'Status of the event', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';
}

export class EventListResponseDto {
  @ApiProperty({ description: 'List of events', type: [EventListItemDto] })
  events: EventListItemDto[];
}
