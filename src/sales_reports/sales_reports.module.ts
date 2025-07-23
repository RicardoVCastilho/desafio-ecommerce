import { Module } from '@nestjs/common';
import { SalesReportsService } from './sales_reports.service';
import { SalesReportsController } from './sales_reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesReportEntity } from './entities/sales_report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesReportEntity])],
  controllers: [SalesReportsController],
  providers: [SalesReportsService],
})
export class SalesReportsModule {}
