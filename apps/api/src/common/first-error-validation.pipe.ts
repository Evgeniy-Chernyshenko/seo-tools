import {
  Injectable,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class FirstErrorValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,

      exceptionFactory: (errors: ValidationError[]) => {
        const firstError = errors[0];
        const firstErrorMessage = getFirstErrorMessage(firstError);

        return new BadRequestException(firstErrorMessage);
      },
    });
  }
}

const getFirstErrorMessage = (error: ValidationError): string => {
  const firstChildren = error.children?.[0];

  if (!firstChildren) {
    const { property, constraints } = error;
    const message = constraints ? Object.values(constraints)[0] : undefined;

    return [property, ...(message ? [message] : [])].join(': ');
  }

  return [error.property, getFirstErrorMessage(firstChildren)].join('.');
};
