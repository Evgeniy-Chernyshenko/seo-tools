import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { AppRequest } from 'src/common/common.types';

export const CurrentUser = createParamDecorator(
  (property: keyof User | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AppRequest>();

    return property !== undefined ? request.user?.[property] : request.user;
  },
);
