import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { ExcelActionDelegate } from '~delegates/services/excel-action-delegate.service';
import { QueueMessage } from '~delegates/types/queue-message.type';
import {
  UPLOAD_METRIC,
  UPLOAD_METRIC_EXCEL_QUEUE_NAME,
} from '~metrics/constants/upload-metric-excel-queue-name.constant';
import { MetricOperationService } from '~metrics/services/metric-operation.service';

@Processor(UPLOAD_METRIC_EXCEL_QUEUE_NAME)
export class MetricExcelUploadProcessor {
  constructor(
    private excelActionDelegate: ExcelActionDelegate,
    private metricOperationService: MetricOperationService,
  ) {}

  @Process(UPLOAD_METRIC)
  async handleUploadMetric(job: Job<QueueMessage>) {
    await this.excelActionDelegate.dequeue(
      this.metricOperationService,
      job.data,
    );
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(
      `Completed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job) {
    console.log(
      `Failed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
