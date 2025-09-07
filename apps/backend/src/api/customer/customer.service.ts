import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { PaginationDto, PaginationDetailsDto } from '../../common/dto/pagination.dto';
import { CustomerDbService } from '../../db/customer/customer-db.service';

@Injectable()
export class CustomerService {
  constructor(private readonly customerDbService: CustomerDbService) {}

  async createCustomer(createCustomerDto: CreateCustomerDto, createdBy: string): Promise<CustomerResponseDto> {
    return this.customerDbService.createCustomer(createCustomerDto, createdBy);
  }

  async getAllCustomers(paginationDto: PaginationDto): Promise<{ data: CustomerResponseDto[]; pagination: PaginationDetailsDto }> {
    return this.customerDbService.getAllCustomers(paginationDto);
  }

  async getCustomerById(id: string): Promise<CustomerResponseDto> {
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
}

