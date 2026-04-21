import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  OAuthProviderCallbackQueryDto,
  OAuthProviderParamsDto,
  OAuthProviderResponseDto,
} from './oauth.dto';
import { ApiFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { OAuthService } from './oauth.service';
import {
  OAUTH_CSRF_TOKEN_COOKIE_NAME,
  OAUTH_CSRF_TOKEN_TTL_MS,
} from './oauth.constants';
import { type Response } from 'express';
import { type AppRequest } from 'src/common/common.types';
import { Public } from 'src/common/decorators/public.decorator';
import { UserAgent } from 'src/common/decorators/user-agent.decorator';
import { DEFAULT_COOKIE_OPTIONS } from 'src/common/common.constants';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/app-config/app-config.schema';

@Public()
@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oAuthService: OAuthService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  @Post(':provider')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OAuthProviderResponseDto })
  prepareAuthRedirect(
    @Param() params: OAuthProviderParamsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { csrfToken, redirectUrl } = this.oAuthService.prepareAuthRedirect(
      params.provider,
    );

    response.cookie(OAUTH_CSRF_TOKEN_COOKIE_NAME, csrfToken, {
      ...DEFAULT_COOKIE_OPTIONS,
      maxAge: OAUTH_CSRF_TOKEN_TTL_MS,
    });

    return { redirectUrl };
  }

  @Get(':provider/callback')
  @ApiFoundResponse()
  async callback(
    @Param() params: OAuthProviderParamsDto,
    @Query() query: OAuthProviderCallbackQueryDto,
    @Req() request: AppRequest,
    @Res({ passthrough: true }) response: Response,
    @Ip() ip: string,
    @UserAgent() userAgent?: string,
  ) {
    const storedCsrfToken = request.cookies[OAUTH_CSRF_TOKEN_COOKIE_NAME];

    response.clearCookie(OAUTH_CSRF_TOKEN_COOKIE_NAME);

    try {
      this.oAuthService.validateCsrfToken({
        storedCsrfToken,
        stateCsrfToken: query.state,
      });

      const { session, rawSessionToken } = await this.oAuthService.login({
        providerName: params.provider,
        code: query.code,
        ip,
        userAgent,
      });

      request.session = session;
      request.rawSessionToken = rawSessionToken;
      request.redirect = this.configService.get('OAUTH_SUCCESS_REDIRECT_URL', {
        infer: true,
      });
    } catch {
      request.redirect = this.configService.get('OAUTH_ERROR_REDIRECT_URL', {
        infer: true,
      });
    }
  }
}
