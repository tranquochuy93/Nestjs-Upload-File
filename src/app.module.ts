import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalCacheModule } from '~config/cache.config';
import { databaseConfig } from '~config/database.config';
import { i18nConfig } from '~config/i18n.config';
import { queueConfig } from '~config/queue.config';
import { HttpExceptionFilter } from '~core/filters/http-exception.filter';
import { ExcelActionDelegateModule } from '~delegates/delegate.module';
import { FileModule } from '~files/file.module';
import { MetricModule } from '~metrics/metric.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    databaseConfig,
    i18nConfig,
    queueConfig,
    GlobalCacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MetricModule,
    ExcelActionDelegateModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
