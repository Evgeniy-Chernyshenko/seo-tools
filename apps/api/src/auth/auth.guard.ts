import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRequest } from 'src/common/common.types';
import { SessionsService } from 'src/sessions/sessions.service';
import { UserRole } from 'generated/prisma/enums';
import { UsersService } from 'src/users/users.service';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { IS_ALLOW_UNVERIFIED_KEY } from 'src/common/decorators/allow-unverified.decorator';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { SESSION_TOKEN_COOKIE_NAME } from 'src/common/common.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
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

    if (!isAllowUnverified && !request.user.isVerified) {
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

    const user = await this.usersService.findById(session.userId);

    if (!user) {
      return;
    }

    const refreshedSession = await this.sessionsService.refresh(session.id);

    request.user = user;
    request.session = refreshedSession;
    request.rawSessionToken = rawToken;
  }
}
