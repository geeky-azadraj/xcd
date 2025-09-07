import { LoggerService } from '@logger/logger.service';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, NextFunction } from 'express';

@Injectable()
export class RefreshTokenVerificationMiddleware implements NestMiddleware {
    private readonly refreshTokenSecret: string;
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
    ) {
        this.refreshTokenSecret = this.configService.get('REFRESH_SECRET');
    }

    async use(req: Request, next: NextFunction) {
        const refreshToken = req.cookies?.['refresh_token'];

        if (!refreshToken) {
            this.logger.warn('Missing or malformed Authorization token', 'RefreshTokenVerificationMiddleware');
            throw new UnauthorizedException('TOKEN_MISSING');
        }
        const token = refreshToken;
        const secret = this.refreshTokenSecret;
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret,
            });
            this.logger.log(`Refresh token verified for user: ${payload.sub}`, 'RefreshTokenVerificationMiddleware');

            req['user'] = payload;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                this.logger.warn(`Expired token`, 'RefreshTokenVerificationMiddleware');
                throw new UnauthorizedException('REFRESH_TOKEN_EXPIRED');
              }
              this.logger.error(`Invalid token: ${error.message}`, error.stack, 'RefreshTokenVerificationMiddleware');
              throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
        }
    }
}
