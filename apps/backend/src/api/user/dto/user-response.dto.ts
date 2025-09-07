import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'b9cc7613-5e0f-4d22-923e-4a10d7dc251e',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'User avatar URL',
    required: false,
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'User phone number',
    required: false,
    example: '+1234567890',
  })
  phone?: string;

  @ApiProperty({
    description: 'User type',
    example: 'user',
  })
  userType: string;

  @ApiProperty({
    description: 'User status',
    example: 'active',
  })
  status: string;
}
