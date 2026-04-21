import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Session } from 'generated/prisma/client';
import { AppRequest } from 'src/common/common.types';

export const CurrentSession = createParamDecorator(
  (property: keyof Session | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AppRequest>();

    return property !== undefined
      ? request.session?.[property]
      : request.session;
  },
);
