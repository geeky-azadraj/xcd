import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ToggleStatusDto } from './dto/toggle-status.dto';
import { PaginationDto, PaginationDetailsDto, CustomerListResponseDto } from '../../common/dto/pagination.dto';
import { RouteNames } from '@common/route-names';
import { User } from '@common/decorators/user.decorator';
import { UserInfo } from '@common/types/auth.types';

@ApiTags('Customers')
@Controller(RouteNames.CUSTOMERS)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully', type: CustomerResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async create(
    @User() user: UserInfo,
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.createCustomer(createCustomerDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    type: CustomerListResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid pagination parameters' })
  async findAll(@Query() paginationDto: PaginationDto): Promise<{ data: CustomerResponseDto[]; pagination: PaginationDetailsDto }> {
    return this.customerService.getAllCustomers(paginationDto);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get customers by company ID' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully', type: [CustomerResponseDto] })
  async findByCompany(@Param('companyId') companyId: string): Promise<CustomerResponseDto[]> {
    return this.customerService.getCustomersByCompany(companyId);
  }

  @Get('searchby')
  @ApiOperation({ summary: 'Search customers by name or email' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query for customer name or email' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully', type: [CustomerResponseDto] })
  @ApiResponse({ status: 400, description: 'Bad request - missing search query' })
  async searchCustomers(@Query('q') query: string): Promise<CustomerResponseDto[]> {
    if (!query || query.trim() === '') {
      throw new BadRequestException('Search query is required');
    }
    return this.customerService.searchCustomers(query);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get customers by status' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully', type: [CustomerResponseDto] })
  @ApiResponse({ status: 400, description: 'Bad request - invalid status' })
  async findByStatus(@Param('status') status: string): Promise<CustomerResponseDto[]> {
    const validStatuses = ['active', 'inactive', 'deleted'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    return this.customerService.getCustomersByStatus(status);
  }

  @Get(':customerId')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid ID format' })
  async findOne(@Param('customerId') customerId: string): Promise<CustomerResponseDto> {
    return this.customerService.getCustomerById(customerId);
  }

  @Patch(':customerId')
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data or ID format' })
  async update(
    @Param('customerId') customerId: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.updateCustomer(customerId, updateCustomerDto);
  }

  @Delete(':customerId')
  @ApiOperation({ summary: 'Delete customer (soft delete)' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid ID format' })
  async remove(@Param('customerId') customerId: string): Promise<void> {
    return this.customerService.deleteCustomer(customerId);
  }

  @Patch(':customerId/toggle-status')
  @ApiOperation({ summary: 'Enable or disable customer' })
  @ApiResponse({ status: 200, description: 'Customer status updated successfully', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data or ID format' })
  async toggleStatus(
    @Param('customerId') customerId: string,
    @Body() toggleStatusDto: ToggleStatusDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.toggleCustomerStatus(customerId, toggleStatusDto.enable);
  }
}

