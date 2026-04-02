import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest } from 'src/auth/auth.types';

export const CurrentSession = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AppRequest>();

    return request.session;
  },
);
