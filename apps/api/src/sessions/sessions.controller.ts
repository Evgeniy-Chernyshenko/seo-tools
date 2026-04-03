import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { Serialize } from 'src/common/serialize.decorator';
import { SessionResponseDto } from './sessions.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

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
  @ApiNotFoundResponse()
  async deleteSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.sessionsService.deleteByIdForUser({ sessionId, userId });
  }
}
