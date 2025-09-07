import { Injectable, NotFoundException } from '@nestjs/common';
import { SSOUser } from './interfaces/sso-user.interface';
import { LoginResponseDto } from './dto/auth.dto';
import { CustomJwtService } from '@common/services/jwt.service';
import { UserDBService } from '@db/user/user-db.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDBService: UserDBService,
    private readonly jwtService: CustomJwtService,
  ) {}

  async findOrCreateUser(ssoUser: SSOUser): Promise<LoginResponseDto> {
    // First, try to find user by provider and provider_id
    let user = await this.userDBService.findUserByEmail(ssoUser.email);

    if (user) {
      // Update last login and user info
      user = await this.userDBService.updateUser(user.id, ssoUser);
    } else {
      // Create new user
      user = await this.userDBService.createUser(ssoUser);
    }

    const accessToken = await this.jwtService.generateAuthToken(
      user
    );
    const refreshToken = await this.jwtService.generateRefreshToken(
      user.id
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }

  async refreshToken(userId: string) {
    const user = await this.userDBService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    const accessToken = await this.jwtService.generateAuthToken(
      user
    );
    return {
      access_token: accessToken
    };
  }
}