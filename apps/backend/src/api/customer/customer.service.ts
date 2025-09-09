import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomerListQueryDto } from './dto/customer-list-query.dto';
import { PaginationDetailsDto } from '../../common/dto/pagination.dto';
import { CustomerDbService } from '../../db/customer/customer-db.service';
import { CustomersMetadataListResponseDto } from './dto/customers-metadata-list-response.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerDbService: CustomerDbService) {}

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    // Use existing valid IDs from database (no unique constraint on user_id now)
    const hardcodedCompanyId = '6ba7b817-9dad-11d1-80b4-00c04fd430c8'; // Existing company ID
    const hardcodedUserId = '550e8400-e29b-41d4-a716-446655440002'; // Can reuse same user ID now
    const hardcodedCompanyName = 'EventHub International';
    const hardcodedCreatedBy = '550e8400-e29b-41d4-a716-446655440002'; // Same as userId
    
    return this.customerDbService.createCustomer(
      createCustomerDto, 
      hardcodedCreatedBy, 
      hardcodedUserId,
      hardcodedCompanyId,
      hardcodedCompanyName
    );
  }

  async getAllCustomers(queryDto: CustomerListQueryDto): Promise<{ data: CustomerResponseDto[]; pagination: PaginationDetailsDto }> {
    return this.customerDbService.getAllCustomers(queryDto);
  }

  async getCustomerById(id: string): Promise<any> {
    return this.customerDbService.getCustomerById(id);
  }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    return this.customerDbService.updateCustomer(id, updateCustomerDto);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.customerDbService.deleteCustomer(id);
  }

  async getCustomersByStatus(status: string): Promise<CustomerResponseDto[]> {
    return this.customerDbService.getCustomersByStatus(status);
  }

  async getCustomersByCompany(companyId: string): Promise<CustomerResponseDto[]> {
    return this.customerDbService.getCustomersByCompany(companyId);
  }

  async searchCustomers(query: string): Promise<CustomerResponseDto[]> {
    return this.customerDbService.searchCustomers(query);
  }

  async toggleCustomerStatus(id: string, enable: boolean): Promise<CustomerResponseDto> {
    return this.customerDbService.toggleCustomerStatus(id, enable);
  }

  /**
   * Get all customers metadata
   */
  async getCustomersMetadata(search?: string): Promise<CustomersMetadataListResponseDto> {
    const customersMetadata = await this.customerDbService.getCustomersMetadata(search) as Array<{id: string, company_name: string}>;
    return {
      customers: customersMetadata.map(item => ({
        id: item.id,
        name: item.company_name,
      })),
    };
  }
}

