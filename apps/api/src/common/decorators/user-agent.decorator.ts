import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest } from '../common.types';

export const UserAgent = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AppRequest>();

    return request.headers['user-agent'];
  },
);
