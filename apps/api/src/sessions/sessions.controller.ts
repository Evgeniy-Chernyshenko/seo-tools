import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { SessionResponseDto } from './sessions.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentSession } from 'src/common/decorators/current-session.decorator';
import { type AppRequest } from 'src/common/common.types';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Serialize(SessionResponseDto)
  @Get()
  @ApiOkResponse({ type: [SessionResponseDto] })
  getSessions(@CurrentUser('id') userId: string) {
    return this.sessionsService.findAllByUserId(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(
    @CurrentUser('id') userId: string,
    @CurrentSession('id') currentSessionId: string,
    @Param('id') sessionId: string,
    @Req() request: AppRequest,
  ) {
    await this.sessionsService.deleteByIdForUser({
      sessionId,
      userId,
    });

    if (sessionId === currentSessionId) {
      request.session = undefined;
      request.rawSessionToken = undefined;
    }
  }
}
