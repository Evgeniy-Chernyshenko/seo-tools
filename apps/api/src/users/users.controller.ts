import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { type User } from 'generated/prisma/client';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { MeResponseDto } from './users.dto';
import { AllowUnverified } from 'src/common/decorators/allow-unverified.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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
