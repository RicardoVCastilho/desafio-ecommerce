import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesReportEntity } from './entities/sales_report.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateSalesReportDto } from './dto/create-sales_report.dto';
import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateSalesReportDto } from './dto/update-sales_report.dto';

@Injectable()
export class SalesReportsService {
  constructor(
    @InjectRepository(SalesReportEntity)
    private salesReportRepository: Repository<SalesReportEntity>,
    private dataSource: DataSource,
  ) { }

  async create(createDto: CreateSalesReportDto) {
    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);

    // Consulta SQL agregando vendas por produto
    const result = await this.dataSource.query(
      `
SELECT
  p.name AS product,
  SUM(oi.quantity) AS total_quantity_sold,
  SUM(oi.quantity * oi."unitPrice") AS total_revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN orders o ON o.id = oi.order_id
WHERE o."orderDate" BETWEEN $1 AND $2
GROUP BY p.name
ORDER BY total_quantity_sold DESC

    `,
      [startDate, endDate],
    );

    // Diretório para salvar o CSV
    const fileName = `report-${Date.now()}.csv`;
    const filePath = path.join(__dirname, '..', '..', 'reports', fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'product', title: 'Product' },
        { id: 'total_quantity_sold', title: 'Quantity Sold' },
        { id: 'total_revenue', title: 'Total Revenue' },
      ],
    });

    await csvWriter.writeRecords(result);

    // Cálculo dos valores para salvar no banco
    const period = startDate;
    const totalSales = result.reduce((acc, curr) => acc + Number(curr.total_revenue), 0);
    const productsSold = result.reduce((acc, curr) => acc + Number(curr.total_quantity_sold), 0);

    // Salva no banco o caminho do relatório
    const report = this.salesReportRepository.create({
      filePath: filePath,
      period: period,
      totalSales: totalSales,
      productsSold: productsSold,
    });

    await this.salesReportRepository.save(report);

    return { message: 'Report generated successfully', report };
  }

  async findAll(): Promise<SalesReportEntity[]> {
    return this.salesReportRepository.find();
  }

  async findOne(id: number): Promise<SalesReportEntity> {
    const report = await this.salesReportRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException(`Relatório com id ${id} não encontrado.`);
    }
    return report;
  }

  async update(id: number, updateDto: UpdateSalesReportDto): Promise<SalesReportEntity> {
    const report = await this.salesReportRepository.preload({
      id,
      ...updateDto,
    });

    if (!report) {
      throw new NotFoundException(`Relatório com id ${id} não encontrado.`);
    }

    return this.salesReportRepository.save(report);
  }

  async remove(id: number): Promise<void> {
    const report = await this.salesReportRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException(`Relatório com id ${id} não encontrado.`);
    }
    await this.salesReportRepository.remove(report);
  }
}