import { CookieOptions } from 'express';

export const SESSION_TOKEN_COOKIE_NAME = 'sessionToken';

export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
};
