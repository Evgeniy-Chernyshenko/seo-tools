import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SessionResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  ip: string;

  @Expose()
  @ApiProperty({ type: String, nullable: true })
  userAgent: string | null;

  @Expose()
  @ApiProperty({ type: String, nullable: true })
  country: string | null;

  @Expose()
  @ApiProperty({ type: String, nullable: true })
  city: string | null;

  @Expose()
  @ApiProperty()
  expiresAt: Date;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
