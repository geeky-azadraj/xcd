import { ICookieOptions } from '@common/types/auth.types';
import { EnvConfig } from '@config/env.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class CookieService {
  private readonly SET_COOKIE_OPTIONS: ICookieOptions;
  private readonly JWT_TOKEN_EXPIRY: number;
  private readonly REFRESH_TOKEN_EXPIRY: number;
  private readonly env: string;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.JWT_TOKEN_EXPIRY =
      this.configService.get<number>('JWT_EXPIRES_IN') * 1000;
    this.REFRESH_TOKEN_EXPIRY =
      this.configService.get<number>('JWT_REFRESH_EXPIRES_IN') * 1000;
    this.env = this.configService.get<string>('NODE_ENV') || 'development';

    this.SET_COOKIE_OPTIONS = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/'
    };
  }

  setOnboardingCookie(res: Response) {
    res.cookie('onboarding', 'true', {
      ...this.SET_COOKIE_OPTIONS,
      maxAge: this.JWT_TOKEN_EXPIRY, // same as jwt token expiry
    });
  }

  setAuthCookie(
    res: Response,
    accessToken?: string,
    refreshToken?: string,
  ) {
    if (accessToken) {
      res.cookie('access_token', accessToken, {
        ...this.SET_COOKIE_OPTIONS,
        maxAge: this.JWT_TOKEN_EXPIRY,
      });
    }

    if (refreshToken) {
      res.cookie(
        'refresh_token',
        refreshToken,
        {
          ...this.SET_COOKIE_OPTIONS,
          maxAge: this.REFRESH_TOKEN_EXPIRY,
        },
      );
    }
  }

  deleteCookies(res: Response, ...cookieNames: string[]) {
    cookieNames.forEach((cookie) => {
      res.clearCookie(cookie, {
        ...this.SET_COOKIE_OPTIONS,
        maxAge: 0,
      });
    });
  }

  deleteAuthCookies(req: Request, res: Response) {
    const cookieNames = ['access_token', 'refresh_token'];
    this.deleteCookies(res, ...cookieNames);
  }

  private shouldDeleteCookie(cookieName: string): boolean {
    const isAdminCookie = cookieName.startsWith('access_token');
    const isCommon = cookieName === 'onboarding';

    if (isAdminCookie) return isAdminCookie || isCommon;
    return !isAdminCookie;
  }

  deleteAllCookies(req: Request, res: Response) {
    const allCookies = req.cookies || {};

    Object.keys(allCookies).forEach((cookieName) => {
      if (this.shouldDeleteCookie(cookieName)) {
        res.clearCookie(cookieName, {
          ...this.SET_COOKIE_OPTIONS,
          maxAge: 0,
        });
      }
    });
  }
}
