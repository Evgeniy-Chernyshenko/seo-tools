import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config.schema';

export const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV}`,
  validate: (config) => envSchema.parse(config),
});
