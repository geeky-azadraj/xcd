import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventsDBRepository, CreateEventData } from './events-db.repository';
import { EventFilters } from '../../api/event/dto/event-filter.dto';
import { CreateEventDto } from '../../api/event/dto/create-event.dto';
import { JsonValue } from '@prisma/client/runtime/library';
import { EventOverviewResponseDto } from '@api/event/dto/event-overview-response.dto';

export interface EventListItem {
  eventLogo: string;
  eventName: string;
  eventType: string;
  eventStartDate: string;
  eventEndDate: string;
  status: 'active' | 'inactive';
}

@Injectable()
export class EventsDBService {
  constructor(private readonly eventsRepository: EventsDBRepository) {}

  /**
   * Create a new event
   */
  async createEvent(userId: string, createEventDto: CreateEventDto) {
    // Get customer by user ID
    const customer = await this.eventsRepository.getCustomerByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer not found for the given user');
    }

    // Validate dates
    this.validateEventDates(createEventDto);

    // Prepare event data
    const eventData: CreateEventData = {
      customerId: customer.id,
      eventName: createEventDto.eventTitle,
      eventType: 'conference', // Default type, can be made configurable
      venueAddress: createEventDto.eventVenue as undefined as JsonValue,
      startDate: new Date(createEventDto.eventStartDate),
      endDate: new Date(createEventDto.eventEndDate),
      bookingStartDate: new Date(createEventDto.bookingStartDate),
      bookingEndDate: new Date(createEventDto.bookingEndDate),
      currencyType: createEventDto.currency,
      status: 'draft',
      logoUrl: createEventDto.eventLogo,
      supportFirstName: createEventDto.primarySupportContact?.firstName,
      supportLastName: createEventDto.primarySupportContact?.lastName,
      supportEmail: createEventDto.primarySupportContact?.supportEmail,
      supportPhoneNumber: createEventDto.primarySupportContact?.phoneNumber,
      supportUrl: createEventDto.primarySupportContact?.supportUrl,
      eventCategoryType: 'general',
    };

    // Create event
    const event = await this.eventsRepository.createEvent(eventData);

    // Update customer event count
    await this.eventsRepository.updateCustomerEventCount(customer.id, true);

    return event;
  }

  /**
   * Get all events for a customer
   */
  async getEventsByCustomer(userId: string, filters?: EventFilters) {
    const customer = await this.eventsRepository.getCustomerByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer not found for the given user');
    }

    const events = await this.eventsRepository.getEventsByCustomerId(customer.id, filters);
    
    return this.mapEventsToList(events);
  }

  /**
   * Get event overview
   */
  async getEventOverview(userId: string, eventId: string): Promise<EventOverviewResponseDto> {
    const customer = await this.eventsRepository.getCustomerByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer not found for the given user');
    }

    const event = await this.eventsRepository.getEventById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify event belongs to customer
    if (event.customer_id !== customer.id) {
      throw new NotFoundException('Event not found for this customer');
    }

    // Map to overview format
    return this.mapEventToOverview(event);
  }

  /**
   * Validate event dates
   */
  private validateEventDates(createEventDto: CreateEventDto) {
    const eventStartDate = new Date(createEventDto.eventStartDate);
    const eventEndDate = new Date(createEventDto.eventEndDate);
    const bookingStartDate = new Date(createEventDto.bookingStartDate);
    const bookingEndDate = new Date(createEventDto.bookingEndDate);

    if (eventStartDate >= eventEndDate) {
      throw new BadRequestException('Event start date must be before end date');
    }

    if (bookingStartDate >= bookingEndDate) {
      throw new BadRequestException('Booking start date must be before end date');
    }

    if (bookingEndDate > eventStartDate) {
      throw new BadRequestException('Booking end date must be before or on event start date');
    }

    const today = new Date();
    if (bookingStartDate < today) {
      throw new BadRequestException('Booking start date cannot be in the past');
    }
  }

  /**
   * Map events to list format
   */
  private mapEventsToList(events: any[]): EventListItem[] {
    return events.map(event => ({
      eventLogo: event.logo_url || '',
      eventName: event.event_name,
      eventType: event.event_type || 'Conference',
      eventStartDate: event.start_date.toISOString().split('T')[0],
      eventEndDate: event.end_date.toISOString().split('T')[0],
      status: event.status,
    }));
  }

  private mapEventToOverview(event: any): EventOverviewResponseDto {
    return {
      eventId: event.id,
      eventTitle: event.event_name,
      eventLogo: event.logo_url || '',
      eventStartDate: event.start_date.toISOString().split('T')[0],
      eventEndDate: event.end_date.toISOString().split('T')[0],
      eventVenue: event.venue_address as { city: string; venue: string },
      currency: event.currency_type,
      bookingStartDate: event.booking_start_date.toISOString().split('T')[0],
      bookingEndDate: event.booking_end_date.toISOString().split('T')[0],
      eventStatus: event.status,
      eventCategoryStatus: this.getEventCategoryStatus(event), // TODO: Implement logic based on event categories
      eventPoliciesSetupStatus: this.getEventPoliciesSetupStatus(event), // TODO: Implement logic based on event policies
      totalRevenue: 0, // TODO: Calculate from bookings
      currentMonthRevenue: 0, // TODO: Calculate from bookings
      hotelsAdded: 0, // TODO: Count from hotels table
      totalBookings: 0, // TODO: Count from bookings table
    };
  }

  /**
   * Get event category status
   */
  private getEventCategoryStatus(event: any): string {
    // TODO: Implement logic based on event categories
    return 'completed';
  }

  /**
   * Get event policies setup status
   */
  private getEventPoliciesSetupStatus(event: any): string {
    // TODO: Implement logic based on event policies
    return 'pending';
  }
}
