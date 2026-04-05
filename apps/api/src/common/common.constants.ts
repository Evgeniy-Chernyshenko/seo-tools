import { CookieOptions } from 'express';

export const SESSION_TOKEN_COOKIE_NAME = 'session_token';

export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
};
