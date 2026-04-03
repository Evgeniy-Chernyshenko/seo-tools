import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { type User } from 'generated/prisma/client';
import { AllowUnverified } from 'src/auth/decorators/allow-unverified.decorator';
import { Serialize } from 'src/common/serialize.decorator';
import { MeResponseDto } from './users.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  @AllowUnverified()
  @Serialize(MeResponseDto)
  @Get('me')
  @ApiOkResponse({ type: MeResponseDto })
  me(@CurrentUser() user: User) {
    return user;
  }
}
