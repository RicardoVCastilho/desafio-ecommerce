import { Module } from '@nestjs/common';
import { SalesReportsService } from './sales_reports.service';
import { SalesReportsController } from './sales_reports.controller';

@Module({
  controllers: [SalesReportsController],
  providers: [SalesReportsService],
})
export class SalesReportsModule {}
