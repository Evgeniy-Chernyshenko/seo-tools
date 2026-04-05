import z from 'zod';

export const tokenResponseSchema = z.object({ access_token: z.string() });
