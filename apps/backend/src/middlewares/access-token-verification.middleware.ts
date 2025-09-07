import { LoggerService } from '@logger/logger.service';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AccessTokenVerificationMiddleware implements NestMiddleware {
    private readonly jwtTokenSecret: string;
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
    ) {
        this.jwtTokenSecret = this.configService.get('JWT_SECRET');
    }

    async use(req: Request, next: NextFunction) {
        const accessToken = req.cookies?.['access_token'];

        if (!accessToken) {
            this.logger.warn('Missing or malformed Authorization token', 'AccessTokenVerificationMiddleware');
            throw new UnauthorizedException('TOKEN_MISSING');
        }
        const token = accessToken;
        const secret = this.jwtTokenSecret;
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret,
            });
            this.logger.log(`Access token verified for user: ${payload.sub}`, 'AccessTokenVerificationMiddleware');

            req['user'] = payload;
            next();
        } catch (error) {
            console.log(error)
            if (error.name === 'TokenExpiredError') {
                this.logger.warn(`Expired token`, 'AccessTokenVerificationMiddleware');
                throw new UnauthorizedException('ACCESS_TOKEN_EXPIRED');
              }
              this.logger.error(`Invalid token: ${error.message}`, error.stack, 'AccessTokenVerificationMiddleware');
              throw new UnauthorizedException('INVALID_ACCESS_TOKEN');
        }
    }
}
