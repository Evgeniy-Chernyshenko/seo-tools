import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { Env } from 'src/app-config/app-config.schema';
import { getExpiresAt, hashString } from 'src/common/common.helpers';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  async create({
    userId,
    ip,
    userAgent,
    country,
    city,
  }: {
    userId: string;
    ip?: string;
    userAgent?: string;
    country?: string;
    city?: string;
  }) {
    const rawSessionToken = this.generateToken();
    const tokenHash = hashString(rawSessionToken);

    const session = await this.prismaService.session.create({
      data: {
        userId,
        tokenHash,
        ip,
        userAgent,
        country,
        city,
        expiresAt: getExpiresAt(
          this.configService.get('SESSION_TTL_MS', {
            infer: true,
          }),
        ),
      },
    });

    return { session, rawSessionToken };
  }

  findById(id: string) {
    return this.prismaService.session.findUnique({ where: { id } });
  }

  findByToken(rawToken: string) {
    const tokenHash = hashString(rawToken);

    return this.prismaService.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  findAllByUserId(userId: string) {
    return this.prismaService.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  refresh(sessionId: string) {
    return this.prismaService.session.update({
      where: { id: sessionId },
      data: {
        expiresAt: getExpiresAt(
          this.configService.get('SESSION_TTL_MS', {
            infer: true,
          }),
        ),
      },
    });
  }

  deleteById(sessionId: string) {
    return this.prismaService.session.delete({ where: { id: sessionId } });
  }

  deleteAllByUserId(userId: string) {
    return this.prismaService.session.deleteMany({ where: { userId } });
  }

  // TODO: пока не используется
  deleteAllByUserIdExcept({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }) {
    return this.prismaService.session.deleteMany({
      where: { userId, id: { not: sessionId } },
    });
  }

  private generateToken() {
    return randomBytes(32).toString('hex');
  }
}
