import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

const IS_STRONG_PASSWORD_OPTIONS = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const IsValidPassword = () => {
  return IsStrongPassword(IS_STRONG_PASSWORD_OPTIONS);
};

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsValidPassword()
  @ApiProperty({ example: 'Password-123' })
  password: string;
}

export class VerifyEmailDto {
  @IsString()
  @ApiProperty({ example: '123456' })
  code: string;
}

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'Password-123' })
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;
}

export class VerifyResetPasswordCodeDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '123456' })
  code: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '123456' })
  code: string;

  @IsValidPassword()
  @ApiProperty({ example: 'Password-123' })
  password: string;
}
