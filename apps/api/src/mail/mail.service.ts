import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailConfirmationCode({
    to,
    verificationCode,
  }: {
    to: string;
    verificationCode: string;
  }) {
    await this.sendMail({
      to,
      subject: 'Подтвердите email — SEOTools',
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
      subject: 'Сброс пароля — SEOTools',
      template: 'reset-password-code',
      context: {
        headline: 'Сброс пароля',
        resetPasswordCode,
      },
    });
  }

  private sendMail(sendMailOptions: ISendMailOptions) {
    return this.mailerService.sendMail({
      ...sendMailOptions,
      context: {
        ...sendMailOptions.context,
        appNamePart1: 'SEO',
        appNamePart2: 'Tools',
        currentYear: new Date().getFullYear(),
      },
    });
  }
}
