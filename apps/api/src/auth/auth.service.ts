import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationCodeType } from 'generated/prisma/client';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/app-config/app-config.schema';
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
  VerifyResetPasswordCodeDto,
} from './auth.dto';
import {
  createPasswordHashWithSalt,
  generateVerificationCode,
  verifyPassword,
} from './auth.helpers';
import { getExpiresAt, hashString } from 'src/common/common.helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<Env, true>,
    private readonly prismaService: PrismaService,
  ) {}

  async register({
    dto,
    ip,
    userAgent,
  }: {
    dto: RegisterDto;
    ip: string;
    userAgent: string;
  }) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email уже занят');
    }

    const passwordHash = await createPasswordHashWithSalt(dto.password);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
    });

    const { session, rawSessionToken } = await this.sessionsService.create({
      userId: user.id,
      ip,
      userAgent,
    });

    await this.createAndSendCode({
      userId: user.id,
      email: user.email,
      type: VerificationCodeType.EMAIL_CONFIRMATION,
    });

    return { session, rawSessionToken };
  }

  async login({
    dto,
    ip,
    userAgent,
  }: {
    dto: LoginDto;
    ip: string;
    userAgent: string;
  }) {
    const user = await this.usersService.findByEmail(dto.email);

    if (
      !user ||
      !user.passwordHash ||
      !(await verifyPassword(dto.password, user.passwordHash))
    )
      throw new UnauthorizedException('Неверный email или пароль');

    return this.sessionsService.create({
      userId: user.id,
      ip,
      userAgent,
    });
  }

  async logout(sessionId: string) {
    await this.sessionsService.deleteById(sessionId);
  }

  async logoutAll(userId: string) {
    await this.sessionsService.deleteAllByUserId(userId);
  }

  async verifyEmail({ dto, userId }: { dto: VerifyEmailDto; userId: string }) {
    await this.verifyCode({
      userId,
      type: VerificationCodeType.EMAIL_CONFIRMATION,
      code: dto.code,
      deleteAfter: true,
    });

    await this.usersService.markEmailVerified(userId);
  }

  async resendEmailVerificationCode({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }) {
    await this.createAndSendCode({
      userId,
      email,
      type: VerificationCodeType.EMAIL_CONFIRMATION,
    });
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return;
    }

    await this.createAndSendCode({
      userId: user.id,
      email: user.email,
      type: VerificationCodeType.PASSWORD_RESET,
    });
  }

  async verifyResetPasswordCode(dto: VerifyResetPasswordCodeDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Некорректный или недействительный код');
    }

    await this.verifyCode({
      userId: user.id,
      type: VerificationCodeType.PASSWORD_RESET,
      code: dto.code,
    });
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException(
        'Пользователь с таким email не найден, либо некорректный или недействительный код',
      );
    }

    await this.verifyCode({
      userId: user.id,
      type: VerificationCodeType.PASSWORD_RESET,
      code: dto.code,
      deleteAfter: true,
    });

    const passwordHash = await createPasswordHashWithSalt(dto.newPassword);
    await this.usersService.updatePassword({ userId: user.id, passwordHash });
    await this.sessionsService.deleteAllByUserId(user.id);
  }

  getSessions(userId: string) {
    return this.sessionsService.findAllByUserId(userId);
  }

  async deleteSession({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }) {
    const session = await this.sessionsService.findById(sessionId);

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Сессия не найдена');
    }

    await this.sessionsService.deleteById(sessionId);
  }

  private async createAndSendCode({
    userId,
    email,
    type,
  }: {
    userId: string;
    email: string;
    type: VerificationCodeType;
  }) {
    await this.prismaService.verificationCode.deleteMany({
      where: { userId, type },
    });

    const code = generateVerificationCode();

    await this.prismaService.verificationCode.create({
      data: {
        userId,
        type,
        codeHash: hashString(code),
        expiresAt: getExpiresAt(
          this.configService.get('CODE_TTL_MS', { infer: true }),
        ),
      },
    });

    switch (type) {
      case VerificationCodeType.EMAIL_CONFIRMATION:
        return this.mailService.sendEmailConfirmationCode({
          to: email,
          verificationCode: code,
        });

      case VerificationCodeType.PASSWORD_RESET:
        return this.mailService.sendResetPasswordCode({
          to: email,
          resetPasswordCode: code,
        });
    }
  }

  private async verifyCode({
    userId,
    type,
    code,
    deleteAfter = false,
  }: {
    userId: string;
    type: VerificationCodeType;
    code: string;
    deleteAfter?: boolean;
  }) {
    const record = await this.prismaService.verificationCode.findFirst({
      where: {
        userId,
        type,
        codeHash: hashString(code),
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new BadRequestException('Некорректный или недействительный код');
    }

    if (deleteAfter) {
      await this.prismaService.verificationCode.delete({
        where: { id: record.id },
      });
    }
  }
}
