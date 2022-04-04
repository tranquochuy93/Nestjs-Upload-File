import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ExcelActionDelegateModule } from '~delegates/delegate.module';
import { FileModule } from '~files/file.module';
import { UPLOAD_METRIC_EXCEL_QUEUE_NAME } from './constants/upload-metric-excel-queue-name.constant';
import { MetricController } from './http/controllers/metric.controller';
import { MetricExcelUploadProcessor } from './processors/metric-excel-upload.processor';
import { MetricOperationService } from './services/metric-operation.service';

@Module({
  imports: [
    ExcelActionDelegateModule,
    FileModule,
    BullModule.registerQueue({
      name: UPLOAD_METRIC_EXCEL_QUEUE_NAME,
    }),
  ],
  controllers: [MetricController],
  providers: [MetricOperationService, MetricExcelUploadProcessor],
})
export class MetricModule {}
