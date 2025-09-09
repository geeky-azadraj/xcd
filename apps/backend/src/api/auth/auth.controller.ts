import { Controller, Get, UseGuards, Req, Res, HttpStatus, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { SSOUser } from './interfaces/sso-user.interface';
import { GoogleOAuthGuard } from './guards/google.guard';
import { CookieService } from '@common/services/cookie.service';
import { EnvConfig } from '@config/env.config';
import { RefreshTokenApiResponseDto } from './dto/auth.dto';
import { User } from '@common/decorators/user.decorator';
import { UserInfo } from '@common/types/auth.types';
import { RouteNames } from '@common/route-names';

@ApiTags('Authentication')
@Controller(RouteNames.AUTH)
export class AuthController {
  private frontendUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvConfig>,
    private readonly cookieService: CookieService
  ) {
    this.frontendUrl = this.configService.get('FRONTEND_URL');
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiQuery({ name: 'next_url', type: String, required: false })
  @UseGuards(GoogleOAuthGuard)
  async authenticateWithGoogle(@Req() _req) {}

  @Get('google/callback')
  @ApiOperation({ summary: 'Authenticate user with Google' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Authentication Successful' })
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response, @Query('state') state?: string) {
    const ssoUser: SSOUser = req.user as SSOUser;
    const result = await this.authService.findOrCreateUser(ssoUser);
    let redirectUrl = this.frontendUrl;
    const nextUrl = state?.split('&')?.[1]?.split('=')?.[1] || null;

    this.cookieService.setAuthCookie(res, result.access_token, result.refresh_token);

    if (nextUrl) {
      redirectUrl = `${process.env.FRONTEND_URL}?next_url=${encodeURIComponent(nextUrl)}`;
    }
    return res.redirect(redirectUrl);
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh JWT token', description: 'Include refresh token in the authorisation header' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The access token has been successfully refreshed.',
    type: RefreshTokenApiResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid or expired refresh token.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async refreshToken(@User() user: UserInfo): Promise<RefreshTokenApiResponseDto> {
    return await this.authService.refreshToken(user.id);
  }
}
