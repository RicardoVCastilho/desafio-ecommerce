import { Injectable } from '@nestjs/common';
import { CreateSalesReportDto } from './dto/create-sales_report.dto';
import { UpdateSalesReportDto } from './dto/update-sales_report.dto';

@Injectable()
export class SalesReportsService {
  create(createSalesReportDto: CreateSalesReportDto) {
    return 'This action adds a new salesReport';
  }

  findAll() {
    return `This action returns all salesReports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salesReport`;
  }

  update(id: number, updateSalesReportDto: UpdateSalesReportDto) {
    return `This action updates a #${id} salesReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesReport`;
  }
}
