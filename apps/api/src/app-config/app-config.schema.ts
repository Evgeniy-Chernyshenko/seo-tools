import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),

  PORT: z.coerce.number(),

  DATABASE_URL: z.url(),

  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  MAIL_SECURE: z.preprocess((val) => val === 'true', z.boolean()),
  MAIL_FROM: z.string(),
  MAIL_PREVIEW: z.preprocess((val) => val === 'true', z.boolean()),

  SESSION_TTL_MS: z.coerce.number(),
  CODE_TTL_MS: z.coerce.number(),
});

export type Env = z.infer<typeof envSchema>;
