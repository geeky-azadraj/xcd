import { Injectable } from '@nestjs/common';
import { EventsDBService } from '../../db/events/events-db.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { EventListResponseDto } from './dto/event-list-response.dto';
import { EventOverviewResponseDto } from './dto/event-overview-response.dto';
import { EventFilters } from './dto/event-filter.dto';
import { EventsMetadataListResponseDto } from './dto/events-metadata-list-response.dto';

@Injectable()
export class EventService {
  constructor(private readonly eventsDBService: EventsDBService) {}

  /**
   * Create a new event
   */
  async createEvent(userId: string, createEventDto: CreateEventDto): Promise<CreateEventResponseDto> {
    await this.eventsDBService.createEvent(userId, createEventDto);
    return {
      message: 'Event created successfully',
    };
  }

  /**
   * Get all events for a customer
   */
  async getEventsByCustomer(userId: string, filters?: EventFilters): Promise<EventListResponseDto> {
    const events = await this.eventsDBService.getEventsByCustomer(userId, filters);
    return {
      events
    };
  }

  /**
   * Get event overview
   */
  async getEventOverview(userId: string, eventId: string): Promise<EventOverviewResponseDto> {
    return await this.eventsDBService.getEventOverview(userId, eventId);
  }

  /**
   * Get all events metadata
   */
  async getEventsMetadata(search?: string): Promise<EventsMetadataListResponseDto> {
    const eventsMetadata = await this.eventsDBService.getEventsMetadata(search) as Array<{id: string, event_name: string}>;
    return {
      events: eventsMetadata.map(item => ({
        id: item.id,
        name: item.event_name,
      })),
    };
  }   
}
