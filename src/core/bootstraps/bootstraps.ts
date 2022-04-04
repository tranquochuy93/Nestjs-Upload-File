import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { AppModule } from '~app.module';
import { env } from '~config/env.config';
import { ValidateException } from '~core/exceptions/validate.exception';

export class Bootstrap {
  private app: NestExpressApplication;

  async initApp() {
    this.app = await NestFactory.create<NestExpressApplication>(AppModule);
  }

  initPipes() {
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
        exceptionFactory: (errors) => new ValidateException(errors),
      }),
    );
  }

  initStaticAsset() {
    this.app.useStaticAssets(path.join(env.ROOT_PATH, 'static'), {});
  }

  async start() {
    this.app.set('trust proxy', true);
    await this.app.listen(env.APP_PORT);
  }
}
