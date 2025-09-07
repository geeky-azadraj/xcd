import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions | undefined {
    const request = context.switchToHttp().getRequest();
    const nextUrl = request.query.next_url;
    const device = request.query.device_type ?? 'web';

    let state = `device=${device}`;
    if (nextUrl) {
      state += `&next_url=${nextUrl}`;
    }

    return {
      accessType: 'offline',
      state,
    };
  }
}
