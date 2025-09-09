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
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ToggleStatusDto } from './dto/toggle-status.dto';
import { CustomerListQueryDto } from './dto/customer-list-query.dto';
import { PaginationDetailsDto, CustomerListResponseDto } from '../../common/dto/pagination.dto';
import { CustomersMetadataListResponseDto } from './dto/customers-metadata-list-response.dto';
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
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination, search, filters, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for customer name or email' })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by customer status (active, inactive, deleted)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by field (created_date, customer_name, contact_email)',
  })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, description: 'Sort order (asc, desc)' })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    type: CustomerListResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid parameters' })
  async findAll(@Query() queryDto: CustomerListQueryDto) {
    const result = await this.customerService.getAllCustomers(queryDto);

    // Create pagination object manually
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;

    // Get total count from all customers
    const allResult = await this.customerService.getAllCustomers({ page: 1, limit: 1000 });
    const totalCustomers = allResult.data.length;
    const totalPages = Math.ceil(totalCustomers / limit);

    // Return response with pagination object
    return {
      statusCode: 200,
      status: 'Success',
      message: 'Customers retrieved successfully',
      data: result.data,
      pagination: {
        currentPage: page,
        limit: limit,
        totalPages: totalPages,
        totalCustomers: totalCustomers,
      },
      error: null,
    };
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Get all customers metadata' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search query for company name' })
  @ApiResponse({
    status: 200,
    description: 'List of all customers metadata',
    type: CustomersMetadataListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getCustomersMetadata(@Query('search') search?: string): Promise<CustomersMetadataListResponseDto> {
    return await this.customerService.getCustomersMetadata(search);
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

  // @Get('status/:status')
  // @ApiOperation({ summary: 'Get customers by status' })
  // @ApiResponse({ status: 200, description: 'Customers retrieved successfully', type: [CustomerResponseDto] })
  // @ApiResponse({ status: 400, description: 'Bad request - invalid status' })
  // async findByStatus(@Param('status') status: string): Promise<CustomerResponseDto[]> {
  //   const validStatuses = ['active', 'inactive', 'deleted'];
  //   if (!validStatuses.includes(status)) {
  //     throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  //   }
  //   return this.customerService.getCustomersByStatus(status);
  // }

  @Get(':customerId')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid ID format' })
  async findOne(@Param('customerId') customerId: string): Promise<any> {
    return this.customerService.getCustomerById(customerId);
  }

  @Patch(':customerId')
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data or ID format' })
  async update(
    @Param('customerId') customerId: string,
    @Body() updateCustomerDto: UpdateCustomerDto
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
    @Body() toggleStatusDto: ToggleStatusDto
  ): Promise<CustomerResponseDto> {
    return this.customerService.toggleCustomerStatus(customerId, toggleStatusDto.enable);
  }
}
