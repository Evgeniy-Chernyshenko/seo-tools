import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { Response } from 'express';
import { SESSION_TOKEN_COOKIE_NAME } from './auth.constants';
import { AppRequest } from 'src/auth/auth.types';

@Injectable()
export class SessionTokenCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AppRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        if (!request.session || !request.rawSessionToken) {
          this.clearSessionTokenCookie({ request, response });

          return;
        }

        response.cookie(SESSION_TOKEN_COOKIE_NAME, request.rawSessionToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          expires: request.session.expiresAt,
        });
      }),

      catchError((error: unknown) => {
        if (error instanceof UnauthorizedException) {
          this.clearSessionTokenCookie({ request, response });
        }

        throw error;
      }),
    );
  }

  private clearSessionTokenCookie({
    request,
    response,
  }: {
    request: AppRequest;
    response: Response;
  }) {
    if (request.cookies?.[SESSION_TOKEN_COOKIE_NAME]) {
      response.clearCookie(SESSION_TOKEN_COOKIE_NAME);
    }
  }
}
