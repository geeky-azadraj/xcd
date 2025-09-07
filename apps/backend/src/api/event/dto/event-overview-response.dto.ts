import { ApiProperty } from '@nestjs/swagger';

export class EventVenueResponseDto {
  @ApiProperty({ description: 'City where the event is taking place' })
  city: string;

  @ApiProperty({ description: 'Venue name' })
  venue: string;
}

export class EventOverviewResponseDto {
  @ApiProperty({ description: 'Unique identifier of the event' })
  eventId: string;

  @ApiProperty({ description: 'Title of the event' })
  eventTitle: string;

  @ApiProperty({ description: 'Event logo URL', format: 'uri' })
  eventLogo: string;

  @ApiProperty({ description: 'Start date of the event', format: 'date' })
  eventStartDate: string;

  @ApiProperty({ description: 'End date of the event', format: 'date' })
  eventEndDate: string;

  @ApiProperty({ description: 'Event venue information' })
  eventVenue: EventVenueResponseDto;

  @ApiProperty({ description: 'Currency for the event' })
  currency: string;

  @ApiProperty({ description: 'Start date for booking', format: 'date' })
  bookingStartDate: string;

  @ApiProperty({ description: 'End date for booking', format: 'date' })
  bookingEndDate: string;

  @ApiProperty({ description: 'Current status of the event' })
  eventStatus: string;

  @ApiProperty({ description: 'Status of event category setup' })
  eventCategoryStatus: string;

  @ApiProperty({ description: 'Status of event policies setup' })
  eventPoliciesSetupStatus: string;

  @ApiProperty({ description: 'Total revenue generated' })
  totalRevenue: number;

  @ApiProperty({ description: 'Revenue generated in current month' })
  currentMonthRevenue: number;

  @ApiProperty({ description: 'Number of hotels added' })
  hotelsAdded: number;

  @ApiProperty({ description: 'Total number of bookings' })
  totalBookings: number;
}
