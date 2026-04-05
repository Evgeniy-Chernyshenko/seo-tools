import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import z from 'zod';
import { OAuthProvider } from '../oauth.types';
import { Env } from 'src/app-config/app-config.schema';
import { fetchSafe } from 'src/common/common.helpers';
import { tokenResponseSchema } from '../oauth.schemas';

const userSchema = z.object({
  id: z.number().transform(String),
});

const emailSchema = z.object({
  email: z.email(),
  primary: z.boolean(),
  verified: z.boolean(),
});
const emailResponseSchema = z.array(emailSchema);

@Injectable()
export class GithubOAuthProvider implements OAuthProvider {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  getAuthUrl(state: string) {
    const params = new URLSearchParams({
      client_id: this.configService.get('GITHUB_CLIENT_ID', { infer: true }),
      redirect_uri: this.configService.get('GITHUB_REDIRECT_URI', {
        infer: true,
      }),
      scope: 'user:email',
      state,
    });

    return `https://github.com/login/oauth/authorize?${params}`;
  }

  async getToken(code: string) {
    const data = await fetchSafe(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.configService.get('GITHUB_CLIENT_ID', {
            infer: true,
          }),
          client_secret: this.configService.get('GITHUB_CLIENT_SECRET', {
            infer: true,
          }),
          code,
        }),
      },
      tokenResponseSchema,
    );

    return data.access_token;
  }

  async getProfile(accessToken: string) {
    const user = await fetchSafe(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      userSchema,
    );

    const emails = await fetchSafe(
      'https://api.github.com/user/emails',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      emailResponseSchema,
    );

    const primaryEmail = emails.find(
      (email) => email.primary && email.verified,
    );

    return { id: user.id, email: primaryEmail?.email ?? null };
  }
}
