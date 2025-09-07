import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCustomerDto } from '../../api/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../api/customer/dto/update-customer.dto';
import { CustomerResponseDto } from '../../api/customer/dto/customer-response.dto';
import { PaginationDto, PaginationDetailsDto } from '../../common/dto/pagination.dto';
import { CustomerLocation, isValidLocation } from '../../api/customer/interfaces/location.interface';
import { CustomerDbRepository } from './customer-db.repository';

@Injectable()
export class CustomerDbService {
  constructor(private readonly customerRepository: CustomerDbRepository) {}

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
      status: record.status,
      totalEvents: record.total_events,
      createdBy: record.created_by,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  async createCustomer(createCustomerDto: CreateCustomerDto, createdBy: string): Promise<CustomerResponseDto> {
    if (createCustomerDto.location && !isValidLocation(createCustomerDto.location)) {
      throw new BadRequestException('Invalid location format');
    }
    console.log("createdBy", createdBy);

    const created = await this.customerRepository.create({
      user_id: createCustomerDto.userId,
      customer_name: createCustomerDto.customerName,
      contact_email: createCustomerDto.contactEmail,
      contact_phone: createCustomerDto.contactPhone ?? null,
      company_id: createCustomerDto.companyId,
      company_name: createCustomerDto.companyName ?? null,
      location: (createCustomerDto.location as any) ?? null,
      status: createCustomerDto.status || 'active',
      total_events: createCustomerDto.totalEvents ?? 0,
      created_by: createdBy,
    });

    return this.mapDbToDto(created);
  }

  async getAllCustomers(paginationDto: PaginationDto): Promise<{ data: CustomerResponseDto[]; pagination: PaginationDetailsDto }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const items = await this.customerRepository.findMany({
      skip,
      take: limit,
      orderBy: { id: 'desc' },
    });
    const totalCount = await this.customerRepository.count();

    const data = items.map((r) => this.mapDbToDto(r));
    const totalPages = Math.ceil(totalCount / limit);

    const pagination: PaginationDetailsDto = {
      pageNo: page,
      pageSize: limit,
      totalCount,
      totalPages,
    };

    return { data, pagination };
  }

  async getCustomerById(id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return this.mapDbToDto(customer);
  }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    if (updateCustomerDto.location && !isValidLocation(updateCustomerDto.location)) {
      throw new BadRequestException('Invalid location format');
    }

    const updated = await this.customerRepository.update(id, {
      customer_name: updateCustomerDto.customerName,
      contact_email: updateCustomerDto.contactEmail,
      contact_phone: updateCustomerDto.contactPhone ?? undefined,
      company_id: updateCustomerDto.companyId !== undefined ? updateCustomerDto.companyId : undefined,
      company_name: updateCustomerDto.companyName ?? undefined,
      location: (updateCustomerDto.location as any) ?? undefined,
      status: updateCustomerDto.status ?? undefined,
      total_events: updateCustomerDto.totalEvents ?? undefined,
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
}
