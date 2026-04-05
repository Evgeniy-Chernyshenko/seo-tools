import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import z from 'zod';
import { OAuthProvider } from '../oauth.types';
import { Env } from 'src/app-config/app-config.schema';
import { fetchSafe } from 'src/common/common.helpers';
import { tokenResponseSchema } from '../oauth.schemas';

const userInfoResponseSchema = z.object({
  sub: z.string(),
  email: z.email(),
  email_verified: z.boolean(),
});

@Injectable()
export class GoogleOAuthProvider implements OAuthProvider {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  getAuthUrl(state: string) {
    const params = new URLSearchParams({
      client_id: this.configService.get('GOOGLE_CLIENT_ID', { infer: true }),
      redirect_uri: this.configService.get('GOOGLE_REDIRECT_URI', {
        infer: true,
      }),
      response_type: 'code',
      scope: 'email',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async getToken(code: string) {
    const data = await fetchSafe(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.configService.get('GOOGLE_CLIENT_ID', {
            infer: true,
          }),
          client_secret: this.configService.get('GOOGLE_CLIENT_SECRET', {
            infer: true,
          }),
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.configService.get('GOOGLE_REDIRECT_URI', {
            infer: true,
          }),
        }),
      },
      tokenResponseSchema,
    );

    return data.access_token;
  }

  async getProfile(accessToken: string) {
    const data = await fetchSafe(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      userInfoResponseSchema,
    );

    return { id: data.sub, email: data.email_verified ? data.email : null };
  }
}
