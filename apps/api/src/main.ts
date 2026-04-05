import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, getSchemaPath, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ErrorDto } from './common/error.dto';
import { ConfigService } from '@nestjs/config';
import { Env } from './app-config/app-config.schema';
import { SESSION_TOKEN_COOKIE_NAME } from './common/common.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<Env, true>);

  app.use(cookieParser());

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SEOTools API')
      .addCookieAuth(SESSION_TOKEN_COOKIE_NAME)
      .addSecurityRequirements('cookie')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ErrorDto],
    });

    const HTTP_METHODS = [
      'get',
      'post',
      'put',
      'patch',
      'delete',
      'head',
      'options',
    ] as const;

    Object.values(document.paths).forEach((pathItem) => {
      HTTP_METHODS.forEach((method) => {
        const operation = pathItem[method];

        if (!operation?.responses || operation.responses['default']) {
          return;
        }

        operation.responses['default'] = {
          description: 'Error response',
          content: {
            'application/json': {
              schema: { $ref: getSchemaPath(ErrorDto) },
            },
          },
        };
      });
    });

    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(configService.get('PORT', { infer: true }));
}
bootstrap().catch(() => {});
