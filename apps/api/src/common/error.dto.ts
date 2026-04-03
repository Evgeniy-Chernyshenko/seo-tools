import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  @ApiPropertyOptional()
  error?: string;
}
