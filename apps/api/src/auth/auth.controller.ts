import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { User, Session } from 'generated/prisma/client';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  VerifyResetPasswordCodeDto,
  ResetPasswordDto,
} from './auth.dto';
import { type AppRequest } from 'src/common/common.types';
import { Public } from 'src/common/decorators/public.decorator';
import { UserAgent } from 'src/common/decorators/user-agent.decorator';
import { AllowUnverified } from 'src/common/decorators/allow-unverified.decorator';
import { CurrentSession } from 'src/common/decorators/current-session.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { SESSION_TOKEN_COOKIE_NAME } from 'src/common/common.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    headers: {
      'Set-Cookie': {
        schema: {
          example: `${SESSION_TOKEN_COOKIE_NAME}=string`,
        },
      },
    },
  })
  async register(
    @Body() dto: RegisterDto,
    @Req() request: AppRequest,
    @Ip() ip: string,
    @UserAgent() userAgent?: string,
  ) {
    const { session, rawSessionToken } = await this.authService.register({
      dto,
      ip,
      userAgent,
    });

    request.session = session;
    request.rawSessionToken = rawSessionToken;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    headers: {
      'Set-Cookie': {
        schema: {
          example: `${SESSION_TOKEN_COOKIE_NAME}=string`,
        },
      },
    },
  })
  async login(
    @Body() dto: LoginDto,
    @Req() request: AppRequest,
    @Ip() ip: string,
    @UserAgent() userAgent?: string,
  ) {
    const { session, rawSessionToken } = await this.authService.login({
      dto,
      ip,
      userAgent,
    });

    request.session = session;
    request.rawSessionToken = rawSessionToken;
  }

  @AllowUnverified()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    headers: {
      'Set-Cookie': {
        schema: {
          example: `${SESSION_TOKEN_COOKIE_NAME}=`,
        },
      },
    },
  })
  async logout(@CurrentSession() session: Session, @Req() request: AppRequest) {
    await this.authService.logout(session.id);

    request.session = undefined;
    request.rawSessionToken = undefined;
  }

  @AllowUnverified()
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    headers: {
      'Set-Cookie': {
        schema: {
          example: `${SESSION_TOKEN_COOKIE_NAME}=`,
        },
      },
    },
  })
  async logoutAll(
    @CurrentUser('id') userId: string,
    @Req() request: AppRequest,
  ) {
    await this.authService.logoutAll(userId);

    request.session = undefined;
    request.rawSessionToken = undefined;
  }

  @AllowUnverified()
  @Post('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  verifyEmail(@CurrentUser('id') userId: string, @Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail({ dto, userId });
  }

  @AllowUnverified()
  @Post('resend-email-verification-code')
  @HttpCode(HttpStatus.NO_CONTENT)
  resendEmailVerificationCode(@CurrentUser() user: User) {
    return this.authService.resendEmailVerificationCode({
      userId: user.id,
      email: user.email,
      isVerified: user.isVerified,
    });
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('verify-reset-password-code')
  @HttpCode(HttpStatus.NO_CONTENT)
  verifyResetPasswordCode(@Body() dto: VerifyResetPasswordCodeDto) {
    return this.authService.verifyResetPasswordCode(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    headers: {
      'Set-Cookie': {
        schema: {
          example: `${SESSION_TOKEN_COOKIE_NAME}=string`,
        },
      },
    },
  })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() request: AppRequest,
    @Ip() ip: string,
    @UserAgent() userAgent?: string,
  ) {
    const { session, rawSessionToken } = await this.authService.resetPassword({
      dto,
      ip,
      userAgent,
    });

    request.session = session;
    request.rawSessionToken = rawSessionToken;
  }
}
