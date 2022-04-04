import { Injectable, StreamableFile } from '@nestjs/common';
import Excel from 'exceljs';
import { Response } from 'express';
import { parse } from 'node-xlsx';
import * as path from 'path';
import { env } from '~config/env.config';
import { ExcelActionEnum } from '~files/enums/excel-action.enum';
import { ExcelTemplateEnum } from '~files/enums/excel-template.enum';
import {
  XlsxMetricData,
  XlsxMetricSection,
} from '~metrics/types/xlsx-metric-data.type';

@Injectable()
export class ExcelService {
  parseXlsx(fileBuffer: Buffer) {
    const xlsxData = parse(fileBuffer);
    // only get non empty Action row
    return xlsxData[0].data.filter((el) => el[0]);
  }

  convertMetricExcelData(xlsxData): XlsxMetricData[] {
    const xlsxMetricData = xlsxData.reduce((acc: XlsxMetricData[], el: any) => {
      if (!el[0]) {
        return acc;
      }

      const startSectionIndex = 9;
      const endSectionIndex = 21;
      const sections: XlsxMetricSection[] = [];
      for (let i = startSectionIndex; i <= endSectionIndex; i += 2) {
        const title = el[i]?.toString();
        const description = el[i + 1]?.toString();
        if (title && description) {
          sections.push({
            title,
            description,
          });
        }
      }

      const newEle: XlsxMetricData = {
        action: el[0] as ExcelActionEnum,
        name: el[1]?.toString(),
        sections,
      };

      return [...acc, newEle];
    }, [] as XlsxMetricData[]);

    return xlsxMetricData;
  }

  async getTemplateXlsxFile(filename: string): Promise<Excel.Workbook> {
    return new Excel.Workbook().xlsx.readFile(
      path.join(env.ROOT_PATH, `static/xlsx-template/${filename}`),
    );
  }

  async sendXlsxFile(
    res: Response,
    xlsxWorkbook: Excel.Workbook,
    templateType: ExcelTemplateEnum,
  ): Promise<StreamableFile> {
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header(
      'content-type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.header('Content-Disposition', `attachment; filename=${templateType}`);
    const fileBuffer = Buffer.from(await xlsxWorkbook.xlsx.writeBuffer());

    return new StreamableFile(fileBuffer);
  }
}
