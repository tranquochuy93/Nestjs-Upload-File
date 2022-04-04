import { Module } from '@nestjs/common';
import { ExcelService } from './services/excel.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class FileModule {}
