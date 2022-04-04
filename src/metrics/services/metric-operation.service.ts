import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Response } from 'express';
import Joi from 'joi';
import { flattenDeep } from 'lodash';
import { IExcelOperation } from '~delegates/interfaces/excel-operation.interface';
import { ExcelActionEnum } from '~files/enums/excel-action.enum';
import { ExcelTemplateEnum } from '~files/enums/excel-template.enum';
import { ExcelService } from '~files/services/excel.service';
import {
  UPLOAD_METRIC,
  UPLOAD_METRIC_EXCEL_QUEUE_NAME,
} from '~metrics/constants/upload-metric-excel-queue-name.constant';
import { XlsxMetricData } from '~metrics/types/xlsx-metric-data.type';

@Injectable()
export class MetricOperationService implements IExcelOperation {
  constructor(
    @InjectQueue(UPLOAD_METRIC_EXCEL_QUEUE_NAME) private uploadQueue: Queue,
    private excelService: ExcelService,
  ) {}

  validate(xlsxData: XlsxMetricData[]) {
    const schema = Joi.array().items(
      Joi.object({
        action: Joi.string().valid(
          ExcelActionEnum.ADD,
          ExcelActionEnum.UPDATE,
          ExcelActionEnum.REMOVE,
        ),
        name: Joi.string(),
        sections: Joi.array().items(
          Joi.object({
            title: Joi.string(),
            description: Joi.string(),
          }),
        ),
      }),
    );

    const { error } = schema.validate(xlsxData);

    if (error) {
      throw new BadRequestException({
        error,
        translate: 'error.incorrect_format_upload',
      });
    }
  }

  executeFromExcelData() {}

  convertExcelData(xlsxData: any): XlsxMetricData[] {
    return this.excelService.convertMetricExcelData(xlsxData);
  }

  async buildXlsxFile(templateFile: string) {
    const workBook = await this.excelService.getTemplateXlsxFile(templateFile);
    // insert data here

    return workBook;
  }

  async getXlsxFile(res: Response) {
    const workbook = await this.buildXlsxFile(this.templateType);

    return this.excelService.sendXlsxFile(res, workbook, this.templateType);
  }

  get columns(): string[] {
    const sectionColumns = Array.from(new Array(3)).map((val, index) => [
      `Title ${index + 1}`,
      `Description ${index + 1}`,
    ]);

    return ['Action', 'Name', ...flattenDeep(sectionColumns)];
  }

  get messageQueue(): Queue {
    return this.uploadQueue;
  }

  get queueJobName(): string {
    return UPLOAD_METRIC;
  }

  get templateType(): ExcelTemplateEnum {
    return ExcelTemplateEnum.METRIC;
  }
}
