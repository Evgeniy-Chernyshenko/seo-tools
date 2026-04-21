import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/app-config/app-config.schema';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly appConfigService: ConfigService<Env, true>,
  ) {}

  async sendEmailConfirmationCode({
    to,
    verificationCode,
  }: {
    to: string;
    verificationCode: string;
  }) {
    await this.sendMail({
      to,
      subject: 'Подтвердите email — SEMTools',
      template: 'email-confirmation-code',
      context: {
        headline: 'Подтвердите ваш email',
        verificationCode,
      },
    });
  }

  async sendResetPasswordCode({
    to,
    resetPasswordCode,
  }: {
    to: string;
    resetPasswordCode: string;
  }) {
    await this.sendMail({
      to,
      subject: 'Сброс пароля — SEMTools',
      template: 'reset-password-code',
      context: {
        headline: 'Сброс пароля',
        resetPasswordCode,
      },
    });
  }

  private sendMail(sendMailOptions: ISendMailOptions) {
    const appUrl = this.appConfigService.get('APP_URL', { infer: true });

    return this.mailerService.sendMail({
      ...sendMailOptions,
      context: {
        ...sendMailOptions.context,
        appUrl,
        currentYear: new Date().getFullYear(),
      },
    });
  }
}
