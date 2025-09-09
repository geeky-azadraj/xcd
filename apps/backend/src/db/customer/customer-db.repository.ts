import { Injectable } from '@nestjs/common';
import { DBService } from '../db.service';
import { JsonValue } from '@prisma/client/runtime/library';

@Injectable()
export class CustomerDbRepository {
  constructor(private readonly db: DBService) {}

  async create(data: {
    user_id: string;
    customer_name: string;
    contact_email: string;
    contact_phone?: string | null;
    company_id: string;
    company_name?: string | null;
    location?: JsonValue;
    country_code?: string | null;
    status: string;
    total_events: number;
    created_by: string;
  }) {
    return this.db.customers.create({ data });
  }

  async findById(id: string) {
    return this.db.customers.findUnique({ where: { id } });
  }

  async findEventsByCustomerId(customerId: string) {
    return this.db.events.findMany({
      where: { customer_id: customerId },
      orderBy: { created_at: 'desc' }
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    return this.db.customers.findMany(params);
  }

  async count(where?: any) {
    if (where) {
      return this.db.customers.count({ where });
    }
    return this.db.customers.count();
  }

  async update(id: string, data: any) {
    return this.db.customers.update({
      where: { id },
      data,
    });
  }

  async findManyByStatus(status: string) {
    return this.db.customers.findMany({ where: { status } });
  }

  async findManyByCompany(companyId: string) {
    return this.db.customers.findMany({ where: { company_id: companyId } });
  }

  async searchCustomers(query: string) {
    return this.db.customers.findMany({
      where: {
        OR: [
          { customer_name: { contains: query } },
          { contact_email: { contains: query } },
        ],
      },
      orderBy: { id: 'desc' },
    });
  }

  async transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T> {
    return this.db.$transaction(fn);
  }

  /**
   * Get all customers metadata
   */
  async getCustomersMetadata(search?: string) {
    const whereClause = search ? {
      company_name: {
        contains: search.toLowerCase(),
      }
    } : {};
  
    return await this.db.customer_company_metadata.findMany({
      where: whereClause,
      orderBy: { company_name: 'asc' },
    });
  }
}
