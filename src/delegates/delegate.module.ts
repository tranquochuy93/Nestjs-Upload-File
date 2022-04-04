import { Module } from '@nestjs/common';
import { FileModule } from '~files/file.module';
import { ExcelActionDelegate } from './services/excel-action-delegate.service';

@Module({
  imports: [FileModule],
  controllers: [],
  providers: [ExcelActionDelegate],
  exports: [ExcelActionDelegate],
})
export class ExcelActionDelegateModule {}
