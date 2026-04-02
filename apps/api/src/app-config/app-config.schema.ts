import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),

  DATABASE_URL: z.url(),

  MAIL_HOST: z.string(),
  MAIL_PORT: z.preprocess((val) => Number(val), z.number()),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  MAIL_SECURE: z.preprocess(
    (val) => (val === 'true' ? true : false),
    z.boolean(),
  ),
  MAIL_FROM: z.string(),
  MAIL_PREVIEW: z.preprocess(
    (val) => (val === 'true' ? true : false),
    z.boolean(),
  ),

  SESSION_TTL_MS: z.preprocess((val) => Number(val), z.number().positive()),
  CODE_TTL_MS: z.preprocess((val) => Number(val), z.number().positive()),
});

export type Env = z.infer<typeof envSchema>;
