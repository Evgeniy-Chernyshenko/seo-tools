import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Env } from '../app-config/app-config.schema';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => {
        const host = configService.get('MAIL_HOST', { infer: true });
        const port = configService.get('MAIL_PORT', { infer: true });
        const secure = configService.get('MAIL_SECURE', { infer: true });
        const user = configService.get('MAIL_USER', { infer: true });
        const pass = configService.get('MAIL_PASS', { infer: true });
        const from = configService.get('MAIL_FROM', { infer: true });
        const preview = configService.get('MAIL_PREVIEW', { infer: true });

        return {
          transport: {
            host,
            port,
            secure,
            auth: user && pass ? { user, pass } : undefined,
          },
          defaults: {
            from,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
          options: {
            partials: {
              dir: join(__dirname, 'templates/partials'),
              options: {
                strict: true,
              },
            },
          },
          preview,
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
