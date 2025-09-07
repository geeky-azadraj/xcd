import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DBService } from '../db.service';
import { EventFilters } from 'api/event/dto/event-filter.dto';
import { JsonValue } from '@prisma/client/runtime/library';

export interface CreateEventData {
  customerId: string;
  eventName: string;
  eventType?: string;
  eventDescription?: string;
  venueAddress: JsonValue;
  startDate: Date;
  endDate: Date;
  bookingStartDate: Date;
  bookingEndDate: Date;
  currencyType: string;
  status?: string;
  logoUrl?: string;
  supportFirstName?: string;
  supportLastName?: string;
  supportEmail?: string;
  supportPhoneNumber?: string;
  supportUrl?: string;
  eventCategoryType?: string;
}

export interface EventListQuery {
  customerId: string;
  status?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class EventsDBRepository {
  constructor(private readonly dbService: DBService) {}
  

  /**
   * Create a new event
   */
  async createEvent(data: CreateEventData) {
    return await this.dbService.events.create({
      data: {
        customer_id: data.customerId,
        event_name: data.eventName,
        event_type: data.eventType,
        event_description: data.eventDescription,
        venue_address: data.venueAddress !== undefined ? { venue_address: data.venueAddress } : {},
        start_date: data.startDate,
        end_date: data.endDate,
        booking_start_date: data.bookingStartDate,
        booking_end_date: data.bookingEndDate,
        currency_type: data.currencyType,
        status: data.status,
        logo_url: data.logoUrl,
        support_first_name: data.supportFirstName,
        support_last_name: data.supportLastName,
        support_email: data.supportEmail,
        support_phone_number: data.supportPhoneNumber,
        support_url: data.supportUrl,
        event_category_type: data.eventCategoryType,
      }
    });
  }

  /**
   * Get event by ID
   */
  async getEventById(eventId: string) {
    console.log("eventId", eventId);
    return await this.dbService.events.findUnique({
      where: { id: eventId },
    });
  }

  /**
   * Get events by customer ID
   */
  async getEventsByCustomerId(customerId: string, filters?: EventFilters) {
    const conditions: any[] = [
      { customer_id: customerId },
    ];
  
    if (filters?.status) {
      conditions.push({ status: filters.status as any });
    }
  
    if (filters?.dateAdded) {
      conditions.push({ created_at: filters.dateAdded });
    }
  
    if (filters?.lastModified) {
      conditions.push({ updated_at: filters.lastModified });
    }

    if (filters?.upcoming === "true") {
      conditions.push({
        start_date: { gte: new Date() },
      });
    }

    if (filters?.search) {
      conditions.push({
        event_name: { contains: filters.search.toLowerCase() }
      });
    }

    return await this.dbService.events.findMany({
      where: { AND: conditions },
      orderBy: { created_at: 'desc' },
    });
  }


  /**
   * Get customer by user ID
   */
  async getCustomerByUserId(userId: string) {
    return await this.dbService.customers.findUnique({
      where: { user_id: userId },
    });
  }


  /**
   * Update customer total events count
   */
  async updateCustomerEventCount(customerId: string, increment: boolean = true) {
    const customer = await this.dbService.customers.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const newCount = increment 
      ? customer.total_events + 1 
      : Math.max(0, customer.total_events - 1);

    return await this.dbService.customers.update({
      where: { id: customerId },
      data: { total_events: newCount },
    });
  }
}
