import { Controller, Post, Get, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { EventListResponseDto } from './dto/event-list-response.dto';
import { EventOverviewResponseDto } from './dto/event-overview-response.dto';
import { EventFilters } from './dto/event-filter.dto';
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
    @User() user: UserInfo,
    @Body() createEventDto: CreateEventDto,
  ): Promise<CreateEventResponseDto> {
    return await this.eventService.createEvent(user.id, createEventDto);
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
    @User() user: UserInfo,
    @Query() filters: EventFilters): Promise<EventListResponseDto> {    
    return await this.eventService.getEventsByCustomer(user.id, filters);
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
    @User() user: UserInfo,
    @Param('eventId') eventId: string,
  ): Promise<EventOverviewResponseDto> {
    return await this.eventService.getEventOverview(user.id, eventId);
  }
}
