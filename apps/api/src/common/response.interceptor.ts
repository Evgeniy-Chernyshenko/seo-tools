import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { Response } from 'express';
import { AppRequest } from 'src/common/common.types';
import {
  DEFAULT_COOKIE_OPTIONS,
  SESSION_TOKEN_COOKIE_NAME,
} from './common.constants';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
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
          ...DEFAULT_COOKIE_OPTIONS,
          expires: request.session.expiresAt,
        });

        if (request.redirect) {
          response.redirect(request.redirect);
        }
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
