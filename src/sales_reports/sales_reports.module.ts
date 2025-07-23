import { Module } from '@nestjs/common';
import { SalesReportsService } from './sales_reports.service';
import { SalesReportsController } from './sales_reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesReportEntity } from './entities/sales_report.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderItemEntity } from '../order-items/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesReportEntity, OrderEntity, OrderItemEntity])],
  controllers: [SalesReportsController],
  providers: [SalesReportsService],
})
export class SalesReportsModule {}
