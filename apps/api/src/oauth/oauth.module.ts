import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
import { GoogleOAuthProvider } from './providers/google.provider';
import { YandexOAuthProvider } from './providers/yandex.provider';
import { GithubOAuthProvider } from './providers/github.provider';
import { SessionsModule } from 'src/sessions/sessions.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SessionsModule, UsersModule],
  controllers: [OAuthController],
  providers: [
    OAuthService,
    GoogleOAuthProvider,
    YandexOAuthProvider,
    GithubOAuthProvider,
  ],
})
export class OAuthModule {}
