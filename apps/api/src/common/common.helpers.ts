import { createHash } from 'node:crypto';
import z from 'zod';

export const hashString = (value: string) => {
  return createHash('sha256').update(value).digest('hex');
};

export const getExpiresAt = (ttlMs: number) => new Date(Date.now() + ttlMs);

export const fetchSafe = async <T>(
  input: string | URL | Request,
  init: RequestInit = {},
  responseSchema: z.ZodSchema<T>,
  timeoutMs = 5_000,
): Promise<T> => {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(input, { ...init, signal: abortController.signal });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new FetchSafeError('External service timeout');
    }

    throw new FetchSafeError('External service unavailable');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new FetchSafeError(
      `External service responded with ${response.status}`,
    );
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new FetchSafeError('Invalid JSON from external service');
  }

  const parsed = responseSchema.safeParse(json);

  if (!parsed.success) {
    throw new FetchSafeError('Invalid external response');
  }

  return parsed.data;
};

export class FetchSafeError extends Error {}
