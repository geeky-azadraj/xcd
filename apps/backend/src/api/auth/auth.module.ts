import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';
import { DBModule } from '@db/db.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { CustomJwtService } from '@common/services/jwt.service';
import { CookieService } from '@common/services/cookie.service';
import { UserDBService } from '@db/user/user-db.service';
import { UserDBRepository } from '@db/user/user-db.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [],
      useFactory: async (configService: ConfigService<EnvConfig>) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    DBModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    CustomJwtService,
    CookieService,
    UserDBService,
    UserDBRepository
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
