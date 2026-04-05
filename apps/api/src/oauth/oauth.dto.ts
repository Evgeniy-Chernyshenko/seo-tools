import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { OAuthProviderName } from 'generated/prisma/enums';

export class OAuthProviderParamsDto {
  @IsEnum(OAuthProviderName)
  @ApiProperty({ enum: OAuthProviderName })
  provider: OAuthProviderName;
}

export class OAuthProviderResponseDto {
  @ApiProperty()
  redirectUrl: string;
}

export class OAuthProviderCallbackQueryDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsString()
  @ApiProperty()
  state: string;
}
