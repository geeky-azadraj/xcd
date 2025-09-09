import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCustomerDto } from '../../api/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../api/customer/dto/update-customer.dto';
import { CustomerResponseDto } from '../../api/customer/dto/customer-response.dto';
import { CustomerListQueryDto } from '../../api/customer/dto/customer-list-query.dto';
import { PaginationDetailsDto } from '../../common/dto/pagination.dto';
import { CustomerLocation, isValidLocation } from '../../api/customer/interfaces/location.interface';
import { CustomerDbRepository } from './customer-db.repository';

@Injectable()
export class CustomerDbService {
  constructor(private readonly customerRepository: CustomerDbRepository) {}

  async createCustomer(
    createCustomerDto: CreateCustomerDto, 
    createdBy: string, 
    userId: string,
    companyId: string,
    companyName: string
  ): Promise<CustomerResponseDto> {
    if (createCustomerDto.location && !isValidLocation(createCustomerDto.location)) {
      throw new BadRequestException('Invalid location format');
    }

    const created = await this.customerRepository.create({
      user_id: userId,
      customer_name: createCustomerDto.customerName,
      contact_email: createCustomerDto.contactEmail,
      contact_phone: createCustomerDto.contactPhone ?? null,
      company_id: companyId,
      company_name: companyName,
      location: (createCustomerDto.location as any) ?? null,
      country_code: createCustomerDto.countryCode ?? null,
      status: 'active',
      total_events: 0,
      created_by: createdBy,
    });

    return this.mapDbToDto(created);
  }

  private mapDbToDto(record: any): CustomerResponseDto {
    return {
      id: record.id,
      userId: record.user_id,
      customerName: record.customer_name,
      contactEmail: record.contact_email,
      contactPhone: record.contact_phone ?? undefined,
      companyId: record.company_id,
      companyName: record.company_name ?? undefined,
      location: (record.location as CustomerLocation) ?? undefined,
      countryCode: record.country_code ?? undefined,
      status: record.status,
      totalEvents: record.total_events,
      createdBy: record.created_by,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }


  async getAllCustomers(queryDto: CustomerListQueryDto): Promise<{ data: CustomerResponseDto[]; pagination: PaginationDetailsDto }> {
    const { page = 1, limit = 10, search, status, sortBy = 'created_date', sortOrder = 'desc' } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { customer_name: { contains: search } },
        { contact_email: { contains: search } }
      ];
    }

    // Build orderBy clause for sorting
    let orderBy: any = { created_at: 'desc' }; // Default
    if (sortBy === 'customer_name') {
      orderBy = { customer_name: sortOrder };
    } else if (sortBy === 'contact_email') {
      orderBy = { contact_email: sortOrder };
    } else if (sortBy === 'created_date') {
      orderBy = { created_at: sortOrder };
    }

    // Get paginated results
    const [items, totalCount] = await Promise.all([
      this.customerRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy,
      }),
      this.customerRepository.count(where)
    ]);

    const data = items.map((item) => this.mapDbToDto(item));
    const totalPages = Math.ceil(totalCount / limit);

    const pagination: PaginationDetailsDto = {
      currentPage: page,
      limit: limit,
      totalPages: totalPages,
      totalCustomers: totalCount,
    };

    return { data, pagination };
  }

  async getCustomerById(id: string): Promise<any> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Fetch all events for this customer
    let events = [];
    try {
      const customerEvents = await this.customerRepository.findEventsByCustomerId(id);
      events = customerEvents || [];
    } catch (error) {
      console.log('Error fetching events:', error);
      events = [];
    }
    
    const customerData = this.mapDbToDto(customer);
    
    return {
      ...customerData,
      events: events
    };
  }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    if (updateCustomerDto.location && !isValidLocation(updateCustomerDto.location)) {
      throw new BadRequestException('Invalid location format');
    }

    const updated = await this.customerRepository.update(id, {
      customer_name: updateCustomerDto.customerName,
      contact_email: updateCustomerDto.contactEmail,
      contact_phone: updateCustomerDto.contactPhone ?? undefined,
      location: (updateCustomerDto.location as any) ?? undefined,
      country_code: updateCustomerDto.countryCode ?? undefined,
      updated_at: new Date(),
    });

    return this.mapDbToDto(updated);
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.customerRepository.update(id, { 
      status: 'deleted', 
      updated_at: new Date() 
    });
  }

  async getCustomersByStatus(status: string): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findManyByStatus(status);
    return customers.map((r) => this.mapDbToDto(r));
  }

  async getCustomersByCompany(companyId: string): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findManyByCompany(companyId);
    return customers.map((r) => this.mapDbToDto(r));
  }

  async searchCustomers(query: string): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.searchCustomers(query);
    return customers.map((r) => this.mapDbToDto(r));
  }

  async toggleCustomerStatus(id: string, enable: boolean): Promise<CustomerResponseDto> {
    const existing = await this.customerRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    if (existing.status === 'deleted' && enable) {
      throw new BadRequestException('Cannot enable a deleted customer');
    }

    const updated = await this.customerRepository.update(id, { 
      status: enable ? 'active' : 'inactive', 
      updated_at: new Date() 
    });
    return this.mapDbToDto(updated);
  }

  /**
   * Get all customers metadata
   */
  async getCustomersMetadata(search?: string) {
    return await this.customerRepository.getCustomersMetadata(search);
  }
}
