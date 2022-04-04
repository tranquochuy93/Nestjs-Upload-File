import { Queue } from 'bull';
import { Response } from 'express';
import { XlsxMetricData } from '~metrics/types/xlsx-metric-data.type';

export interface IExcelOperation {
  validate(xlsxData: XlsxMetricData[]);

  executeFromExcelData();

  convertExcelData(xlsxData: any): XlsxMetricData[];

  buildXlsxFile(templateFile: string);

  getXlsxFile(res: Response);

  get columns(): string[];

  get messageQueue(): Queue;

  get queueJobName(): string;
}
