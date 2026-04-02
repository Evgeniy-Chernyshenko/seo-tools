import { createHash } from 'node:crypto';

export const hashString = (value: string) => {
  return createHash('sha256').update(value).digest('hex');
};

export const getExpiresAt = (ttlMs: number) => new Date(Date.now() + ttlMs);
