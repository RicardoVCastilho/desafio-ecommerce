import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Res } from '@nestjs/common';
import { SalesReportsService } from './sales_reports.service';
import { CreateSalesReportDto } from './dto/create-sales_report.dto';
import { UpdateSalesReportDto } from './dto/update-sales_report.dto';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('sales-reports')
export class SalesReportsController {
  constructor(private readonly salesReportsService: SalesReportsService) {}

  @Post()
  create(@Body() createSalesReportDto: CreateSalesReportDto) {
    return this.salesReportsService.create(createSalesReportDto);
  }

  @Get('download/:id')
  async downloadReport(@Param('id') id: string, @Res() res: Response) {
    const report = await this.salesReportsService.findOne(+id);
    if (!report) {
      throw new NotFoundException('Relatório não encontrado');
    }

    const filePath = report.filePath;
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Arquivo do relatório não encontrado no servidor');
    }

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Get()
  findAll() {
    return this.salesReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesReportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesReportDto: UpdateSalesReportDto) {
    return this.salesReportsService.update(+id, updateSalesReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesReportsService.remove(+id);
  }
}
