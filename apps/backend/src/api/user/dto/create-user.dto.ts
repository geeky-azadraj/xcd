import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'User password hash (for non-SSO users)',
    required: false,
    example: '$2b$10$hashedpassword',
  })
  @IsOptional()
  @IsString()
  passwordHash?: string;

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
    enum: ['admin', 'user', 'customer'],
    example: 'user',
  })
  @IsString()
  @IsIn(['admin', 'user', 'customer'])
  userType: string;

  @ApiProperty({
    description: 'User status',
    enum: ['active', 'inactive', 'deleted'],
    default: 'active',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'deleted'])
  status?: string;

  @ApiProperty({
    description: 'SSO provider (for SSO users)',
    required: false,
    example: 'google',
  })
  @IsOptional()
  @IsString()
  ssoProvider?: string;

  @ApiProperty({
    description: 'SSO user ID (for SSO users)',
    required: false,
    example: 'google_user_123',
  })
  @IsOptional()
  @IsString()
  ssoUserId?: string;
}
