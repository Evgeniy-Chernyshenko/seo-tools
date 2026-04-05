import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import z from 'zod';
import { OAuthProvider } from '../oauth.types';
import { Env } from 'src/app-config/app-config.schema';
import { fetchSafe } from 'src/common/common.helpers';
import { tokenResponseSchema } from '../oauth.schemas';

const infoResponseSchema = z.object({
  id: z.string(),
  default_email: z.email(),
});

@Injectable()
export class YandexOAuthProvider implements OAuthProvider {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  getAuthUrl(state: string) {
    const params = new URLSearchParams({
      client_id: this.configService.get('YANDEX_CLIENT_ID', { infer: true }),
      redirect_uri: this.configService.get('YANDEX_REDIRECT_URI', {
        infer: true,
      }),
      response_type: 'code',
      scope: 'login:email',
      state,
    });

    return `https://oauth.yandex.ru/authorize?${params}`;
  }

  async getToken(code: string) {
    const data = await fetchSafe(
      'https://oauth.yandex.ru/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.configService.get('YANDEX_CLIENT_ID', {
            infer: true,
          }),
          client_secret: this.configService.get('YANDEX_CLIENT_SECRET'),
        }),
      },
      tokenResponseSchema,
    );

    return data.access_token;
  }

  async getProfile(accessToken: string) {
    const data = await fetchSafe(
      'https://login.yandex.ru/info?format=json',
      {
        headers: {
          Authorization: `OAuth ${accessToken}`,
        },
      },
      infoResponseSchema,
    );

    return { id: data.id, email: data.default_email };
  }
}
