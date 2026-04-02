import { Request } from 'express';
import { Session, User } from 'generated/prisma/client';

export interface AppRequest extends Request {
  user?: User;
  session?: Session;
  rawSessionToken?: string;
  cookies: Record<string, string | undefined>;
}
