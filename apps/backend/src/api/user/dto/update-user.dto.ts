import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address',
    required: false,
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User full name',
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: 'User avatar URL',
    required: false,
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    description: 'User phone number',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'User type',
    required: false,
    enum: ['admin', 'user', 'customer'],
    example: 'user',
  })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user', 'customer'])
  userType?: string;

  @ApiProperty({
    description: 'User status',
    required: false,
    enum: ['active', 'inactive', 'deleted'],
    example: 'active',
  })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'deleted'])
  status?: string;
}
