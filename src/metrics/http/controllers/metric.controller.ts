import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ExcelActionDelegate } from '~delegates/services/excel-action-delegate.service';
import { MetricOperationService } from '~metrics/services/metric-operation.service';

@Controller('metrics')
export class MetricController {
  constructor(
    private excelActionDelegate: ExcelActionDelegate,
    private metricOperationService: MetricOperationService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMetricExcel(@UploadedFile() file: Express.Multer.File) {
    return this.excelActionDelegate.enqueue(this.metricOperationService, file);
  }

  @Get('download')
  async downloadMetricExcel(@Res() res: Response) {
    const file = await this.metricOperationService.getXlsxFile(res);
    file.getStream().pipe(res);
  }
}
