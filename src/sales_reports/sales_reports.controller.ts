import { Controller, Get, Post, Body, Param, NotFoundException, Res, UseGuards } from '@nestjs/common';
import { SalesReportsService } from './sales_reports.service';
import { CreateSalesReportDto } from './dto/create-sales_report.dto';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ApiTags, ApiResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';

@ApiTags('Sales Reports')
@Controller('sales-reports')
export class SalesReportsController {
  constructor(private readonly salesReportsService: SalesReportsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  @ApiOperation({ summary: 'Gerar um novo relatório de vendas' })
  @ApiResponse({ status: 201, description: 'Relatório criado com sucesso.' })
  async create(@Body() createSalesReportDto: CreateSalesReportDto) {
    return await this.salesReportsService.create(createSalesReportDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('all')
  @ApiOperation({ summary: 'Listar todos os relatórios de vendas' })
  async findAll() {
    return await this.salesReportsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('single/:id')
  @ApiOperation({ summary: 'Obter um relatório de vendas por ID' })
  @ApiParam({ name: 'id', description: 'ID do relatório' })
  @ApiNotFoundResponse({ description: 'Relatório não encontrado.' })
  async findOne(@Param('id') id: string) {
    return await this.salesReportsService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get(':id/download')
  @ApiOperation({ summary: 'Download do arquivo CSV do relatório' })
  @ApiParam({ name: 'id', description: 'ID do relatório' })
  @ApiNotFoundResponse({ description: 'Arquivo do relatório não encontrado.' })
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
}
