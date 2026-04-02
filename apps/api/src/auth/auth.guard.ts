import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRequest } from 'src/auth/auth.types';
import { SessionsService } from 'src/sessions/sessions.service';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { IS_ALLOW_UNVERIFIED_KEY } from './decorators/allow-unverified.decorator';
import { UserRole } from 'generated/prisma/enums';
import { ROLES_KEY } from './decorators/roles.decorator';
import { SESSION_TOKEN_COOKIE_NAME } from './auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionsService: SessionsService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<AppRequest>();

    await this.loadSession(request);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!request.user) {
      throw new UnauthorizedException();
    }

    const isAllowUnverified = this.reflector.getAllAndOverride<boolean>(
      IS_ALLOW_UNVERIFIED_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!isAllowUnverified && !request.user.isEmailVerified) {
      throw new ForbiddenException('Email не подтверждён');
    }

    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (roles && !roles.includes(request.user.role)) {
      throw new ForbiddenException();
    }

    return true;
  }

  private async loadSession(request: AppRequest): Promise<void> {
    const rawToken = request.cookies?.[SESSION_TOKEN_COOKIE_NAME];

    if (!rawToken) {
      return;
    }

    const session = await this.sessionsService.findByToken(rawToken);

    if (!session || session.expiresAt < new Date()) {
      return;
    }

    const refreshedSession = await this.sessionsService.refresh(session.id);

    request.user = session.user;
    request.session = refreshedSession;
    request.rawSessionToken = rawToken;
  }
}
