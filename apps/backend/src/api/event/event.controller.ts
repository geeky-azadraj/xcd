import { Controller, Post, Get, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { EventListResponseDto } from './dto/event-list-response.dto';
import { EventOverviewResponseDto } from './dto/event-overview-response.dto';
import { EventFilters } from './dto/event-filter.dto';
import { EventsMetadataListResponseDto } from './dto/events-metadata-list-response.dto';
import { UserInfo } from '@common/types/auth.types';
import { User } from '@common/decorators/user.decorator';
import { RouteNames } from '@common/route-names';

@ApiTags('Event')
@Controller(RouteNames.EVENTS)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Create an event' })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: CreateEventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async createEvent(
    // @User() user: UserInfo,
    @Body() createEventDto: CreateEventDto
  ): Promise<CreateEventResponseDto> {
    const user = '550e8400-e29b-41d4-a716-446655440003';
    return await this.eventService.createEvent(user, createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events of a customer' })
  @ApiResponse({
    status: 200,
    description: 'List of all events for the customer',
    type: EventListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getEventsByCustomer(
    // @User() user: UserInfo,
    @Query() filters: EventFilters
  ): Promise<EventListResponseDto> {
    const user = '550e8400-e29b-41d4-a716-446655440003';
    return await this.eventService.getEventsByCustomer(user, filters);
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Get all events metadata' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search query for event name' })
  @ApiResponse({
    status: 200,
    description: 'List of all events metadata',
    type: EventsMetadataListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getEventsMetadata(@Query('search') search?: string): Promise<EventsMetadataListResponseDto> {
    return await this.eventService.getEventsMetadata(search);
  }

  @Get(':eventId/overview')
  @ApiOperation({ summary: 'Get event overview' })
  @ApiParam({
    name: 'eventId',
    description: 'Unique identifier of the event',
  })
  @ApiResponse({
    status: 200,
    description: 'Event overview details',
    type: EventOverviewResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getEventOverview(
    // @User() user: UserInfo,
    @Param('eventId') eventId: string
  ): Promise<EventOverviewResponseDto> {
    const user = '550e8400-e29b-41d4-a716-446655440003';
    return await this.eventService.getEventOverview(user, eventId);
  }
}
