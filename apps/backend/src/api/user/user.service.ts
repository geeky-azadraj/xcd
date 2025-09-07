import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserDBService } from '../../db/user/user-db.service';

@Injectable()
export class UserService {
  constructor(private readonly userDbService: UserDBService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists with this email
    const existingUser = await this.userDbService.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userDbService.createRegularUser(createUserDto);
    return this.mapToResponseDto(user);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userDbService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userDbService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Check if user exists
    const existingUser = await this.userDbService.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userDbService.findUserByEmail(updateUserDto.email);
      if (emailExists) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const user = await this.userDbService.updateRegularUser(id, updateUserDto);
    return this.mapToResponseDto(user);
  }

  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.userDbService.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userDbService.deleteUser(id);
  }

  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      phone: user.phone,
      userType: user.user_type,
      status: user.status
    };
  }
}
