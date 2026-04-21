import { Injectable } from '@nestjs/common';
import { GoogleOAuthProvider } from './providers/google.provider';
import { OAuthProviderName } from 'generated/prisma/enums';
import { OAuthProvider } from './oauth.types';
import { YandexOAuthProvider } from './providers/yandex.provider';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma/client';
import { SessionsService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OAuthService {
  private readonly providers: Record<OAuthProviderName, OAuthProvider>;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly googleOAuthProvider: GoogleOAuthProvider,
    private readonly yandexOAuthProvider: YandexOAuthProvider,
  ) {
    this.providers = {
      [OAuthProviderName.google]: googleOAuthProvider,
      [OAuthProviderName.yandex]: yandexOAuthProvider,
    };
  }

  prepareAuthRedirect(providerName: OAuthProviderName) {
    const provider = this.providers[providerName];

    const csrfToken = crypto.randomUUID();

    return { csrfToken, redirectUrl: provider.getAuthUrl(csrfToken) };
  }

  async login({
    providerName,
    code,
    ip,
    userAgent,
  }: {
    providerName: OAuthProviderName;
    code: string;
    ip: string;
    userAgent?: string;
  }) {
    const provider = this.providers[providerName];
    const oAuthAccessToken = await provider.getToken(code);
    const oAuthProfile = await provider.getProfile(oAuthAccessToken);

    if (oAuthProfile.email === null) {
      throw new Error('OAuth provider did not return email');
    }

    const oauthAccount = await this.prismaService.oAuthAccount.findUnique({
      where: {
        providerName_providerUserId: {
          providerName,
          providerUserId: oAuthProfile.id,
        },
      },
      include: { user: true },
    });

    let user: User;
    if (oauthAccount) {
      user = oauthAccount.user;
    } else {
      user = await this.usersService.upsertByOAuth(oAuthProfile.email);

      await this.prismaService.oAuthAccount.create({
        data: {
          providerName,
          providerUserId: oAuthProfile.id,
          userId: user.id,
        },
      });
    }

    const { session, rawSessionToken } = await this.sessionsService.create({
      userId: user.id,
      ip,
      userAgent,
    });

    return { session, rawSessionToken };
  }

  validateCsrfToken({
    storedCsrfToken,
    stateCsrfToken,
  }: {
    storedCsrfToken?: string;
    stateCsrfToken: string;
  }) {
    if (storedCsrfToken !== stateCsrfToken) {
      throw new Error('CSRF token mismatch');
    }
  }
}
