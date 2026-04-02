import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { randomInt } from 'node:crypto';

const SALT_SIZE_BYTES = 16;
const PASSWORD_HASH_LENGTH = 32;

const scryptAsync = promisify(scrypt);

const hashPassword = async (password: string, salt: string) => {
  return (await scryptAsync(password, salt, PASSWORD_HASH_LENGTH)) as Buffer;
};

export const createPasswordHashWithSalt = async (password: string) => {
  const salt = randomBytes(SALT_SIZE_BYTES).toString('hex');
  const hashBuffer = await hashPassword(password, salt);

  return hashBuffer.toString('hex') + '.' + salt;
};

export const verifyPassword = async (
  password: string,
  storedPassword: string,
) => {
  const [storedHash, storedSalt] = storedPassword.split('.');
  const storedHashBuffer = Buffer.from(storedHash, 'hex');

  const hashBuffer = await hashPassword(password, storedSalt);

  if (hashBuffer.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashBuffer, storedHashBuffer);
};

export const generateVerificationCode = () => {
  return String(randomInt(100000, 1000000));
};
