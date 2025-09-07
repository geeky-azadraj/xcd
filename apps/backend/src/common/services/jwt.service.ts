import { UserInfo } from '@common/types/auth.types';
import { EnvConfig } from '@config/env.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomJwtService {
  private readonly jwtTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly jwtTokenExpiry: number;
  private readonly refreshTokenExpiry: number;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvConfig>,
  ) {
    this.jwtTokenSecret = this.configService.get<string>('JWT_SECRET');
    this.refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    this.jwtTokenExpiry = this.configService.get<number>('JWT_EXPIRES_IN');
    this.refreshTokenExpiry = this.configService.get<number>('JWT_REFRESH_EXPIRES_IN');
  }

  async generateAuthToken(user: UserInfo) {
    // Create the payload for the JWT token
    const payload = {
      sub: user.id,
      id: user.id,
      name: user.full_name,
      email: user.email,
      user_type: user.user_type,
      type: 'access',
    };

    // Get the JWT secret from the configuration
    const secret = this.jwtTokenSecret;

    // Sign the payload to generate the JWT token
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.jwtTokenExpiry,
      secret,
    });

    // Return the generated authentication token
    return token;
  }

  async generateRefreshToken(userId: string) {
    // Prepare the payload for the refresh token
    const payload = {
      sub: userId,
      Type: 'refresh'
    };

    // Get the refresh token secret from the configuration
    const secret = this.refreshTokenSecret;

    // Sign the payload using the secret and generate the refresh token
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.refreshTokenExpiry,
      secret,
    });

    // Return the generated refresh token
    return token;
  }

  async verifyAccessToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.jwtTokenSecret,
    });

    return payload;
  }
}
