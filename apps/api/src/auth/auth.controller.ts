import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Post,
  Headers,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentSession } from './decorators/current-session.decorator';
import { Public } from './decorators/public.decorator';
import { AllowUnverified } from './decorators/allow-unverified.decorator';
import type { User, Session } from 'generated/prisma/client';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  VerifyResetPasswordCodeDto,
  ResetPasswordDto,
} from './auth.dto';
import { type AppRequest } from 'src/auth/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(
    @Body() dto: RegisterDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Req() request: AppRequest,
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
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Req() request: AppRequest,
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
  async logout(@CurrentSession() session: Session, @Req() request: AppRequest) {
    await this.authService.logout(session.id);

    request.session = undefined;
    request.rawSessionToken = undefined;
  }

  @AllowUnverified()
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
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
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('sessions')
  getSessions(@CurrentUser('id') userId: string) {
    return this.authService.getSessions(userId);
  }

  @Delete('sessions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.authService.deleteSession({ userId, sessionId });
  }

  @AllowUnverified()
  @Get('me')
  me(@CurrentUser() user: User) {
    return user;
  }
}
