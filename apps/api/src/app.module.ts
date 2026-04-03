import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FirstErrorValidationPipe } from './common/first-error-validation.pipe';
import { MailModule } from './mail/mail.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    SessionsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: FirstErrorValidationPipe,
    },
  ],
})
export class AppModule {}
