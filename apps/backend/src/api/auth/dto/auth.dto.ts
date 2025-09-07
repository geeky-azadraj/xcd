import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsDateString, IsUUID, IsUrl, MinLength, MaxLength } from 'class-validator';

export class UserDto {
  @ApiProperty({ 
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ 
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'User display name',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ 
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg'
  })
  @IsOptional()
  @IsUrl()
  avatar_url?: string;

  @ApiProperty({ 
    description: 'SSO provider name',
    example: 'google',
    enum: ['google', 'github', 'microsoft', 'facebook', 'twitter', 'linkedin', 'discord']
  })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiPropertyOptional({ 
    description: 'Last login timestamp',
    example: '2024-01-27T10:30:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  last_login?: Date;

  @ApiPropertyOptional({ 
    description: 'User account creation timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  created_at?: Date;

  @ApiPropertyOptional({ 
    description: 'User account status',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class LoginResponseDto {
  @ApiProperty({ 
    description: 'JWT access token for API authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @ApiProperty({ 
    description: 'Refresh token for obtaining new access tokens',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @ApiProperty({ 
    description: 'User information',
    type: UserDto
  })
  @IsOptional()
  user?: UserDto;

  @ApiProperty({ 
    description: 'Token expiration time in seconds',
    example: 900
  })
  @IsOptional()
  expires_in?: number;
}

export class RefreshTokenDto {
  @ApiProperty({ 
    description: 'Refresh token for obtaining new access tokens',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  refresh_token: string;
}

export class LogoutDto {
  @ApiProperty({ 
    description: 'Refresh token to revoke during logout',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  refresh_token: string;
}

export class RefreshTokenApiResponseDto {
  @ApiProperty({ 
    description: 'Access token using refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  @IsNotEmpty()
  access_token: string;
}

export class SSOProviderDto {
  @ApiProperty({ 
    description: 'SSO provider identifier',
    example: 'google',
    enum: ['google', 'github', 'microsoft', 'facebook', 'twitter', 'linkedin', 'discord']
  })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ 
    description: 'Human-readable provider name',
    example: 'Google'
  })
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @ApiProperty({ 
    description: 'OAuth login URL for this provider',
    example: 'http://localhost:3000/api/v1/auth/google'
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  login_url: string;

  @ApiPropertyOptional({ 
    description: 'Provider icon URL for UI display',
    example: 'https://developers.google.com/identity/images/g-logo.png'
  })
  @IsOptional()
  @IsUrl()
  icon_url?: string;

  @ApiPropertyOptional({ 
    description: 'Provider description',
    example: 'Sign in with your Google account'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Whether this provider is currently enabled',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}

// Additional DTOs for enhanced SSO functionality

export class AuthErrorDto {
  @ApiProperty({ 
    description: 'Error message',
    example: 'Invalid credentials'
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ 
    description: 'Error code',
    example: 'INVALID_CREDENTIALS'
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ 
    description: 'Additional error details',
    example: { field: 'email', reason: 'User not found' }
  })
  @IsOptional()
  details?: any;
}

export class TokenValidationDto {
  @ApiProperty({ 
    description: 'Whether the token is valid',
    example: true
  })
  @IsBoolean()
  is_valid: boolean;

  @ApiPropertyOptional({ 
    description: 'Token expiration timestamp',
    example: '2024-01-27T11:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  expires_at?: Date;

  @ApiPropertyOptional({ 
    description: 'User information if token is valid',
    type: UserDto
  })
  @IsOptional()
  user?: UserDto;
}

export class AuthStatusDto {
  @ApiProperty({ 
    description: 'Authentication status',
    example: true
  })
  @IsBoolean()
  is_authenticated: boolean;

  @ApiPropertyOptional({ 
    description: 'User information if authenticated',
    type: UserDto
  })
  @IsOptional()
  user?: UserDto;

  @ApiPropertyOptional({ 
    description: 'Available SSO providers',
    type: [SSOProviderDto]
  })
  @IsOptional()
  available_providers?: SSOProviderDto[];
}

export class RevokeTokenDto {
  @ApiProperty({ 
    description: 'Refresh token to revoke',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  refresh_token: string;

  @ApiPropertyOptional({ 
    description: 'Whether to revoke all tokens for the user',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  revoke_all?: boolean;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ 
    description: 'Updated user name',
    example: 'John Smith'
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Updated avatar URL',
    example: 'https://example.com/new-avatar.jpg'
  })
  @IsOptional()
  @IsUrl()
  avatar_url?: string;
}
