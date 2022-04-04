import { BadRequestException, Injectable } from '@nestjs/common';
import { difference } from 'lodash';
import { env } from '~config/env.config';
import { IExcelOperation } from '~delegates/interfaces/excel-operation.interface';
import { QueueMessage } from '~delegates/types/queue-message.type';
import { ExcelService } from '~files/services/excel.service';

@Injectable()
export class ExcelActionDelegate {
  constructor(private excelService: ExcelService) {}

  parseXlsxData(data: QueueMessage) {
    const { buffer, offset, limit } = data;
    const xlsxData = this.excelService
      .parseXlsx(Buffer.from(buffer))
      .splice(offset, limit);

    // remove column name
    if (offset === 0) {
      xlsxData.shift();
    }

    return xlsxData;
  }

  validateColumnFormat(operationService: IExcelOperation, xlsxData: unknown[]) {
    const diff = difference(operationService.columns, xlsxData[0]);
    if (diff.length > 0) {
      throw new BadRequestException({
        translate: 'error.incorrect_format_title_name',
      });
    }
  }

  async enqueue(operationService: IExcelOperation, file: Express.Multer.File) {
    const columnNames = await this.excelService.parseXlsx(file.buffer);

    this.validateColumnFormat(operationService, columnNames);

    const queueMessage: QueueMessage = {
      buffer: file.buffer,
      offset: 0,
      limit: env.EXCEL_JOB_PATCH_LIMIT,
    };

    operationService.messageQueue.add(
      operationService.queueJobName,
      queueMessage,
    );
  }

  dequeue(operationService: IExcelOperation, jobData: QueueMessage) {
    const xlsxData = this.parseXlsxData(jobData);
    const convertedExcelData = operationService.convertExcelData(xlsxData);

    operationService.validate(convertedExcelData);
    operationService.executeFromExcelData();
  }
}
