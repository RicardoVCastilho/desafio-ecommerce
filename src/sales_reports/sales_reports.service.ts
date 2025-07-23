import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SalesReportEntity } from './entities/sales_report.entity';
import { CreateSalesReportDto } from './dto/create-sales_report.dto';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { OrderItemEntity } from 'src/order-items/entities/order-item.entity';
import { OrderStatus } from 'src/utility/common/order-status.enum';
import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

@Injectable()
export class SalesReportsService {
  constructor(
    @InjectRepository(SalesReportEntity)
    private readonly salesReportRepo: Repository<SalesReportEntity>,

    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
  ) { }

  async create(createSalesReportDto: CreateSalesReportDto): Promise<SalesReportEntity> {
    const { startDate, endDate } = createSalesReportDto;

    // Busca pedidos pagos dentro do período com itens e produtos relacionados
    const orders = await this.orderRepo.find({
      where: {
        orderDate: Between(new Date(startDate), new Date(endDate)),
        status: OrderStatus.PAID,
      },
      relations: ['items', 'items.product'],
    });

    if (!orders.length) {
      throw new NotFoundException('Nenhuma venda encontrada no período informado.');
    }

    let totalSales = 0;
    let productsSold = 0;

    // Define tipo para o CSV para o TypeScript
    const csvData: {
      orderId: number;
      productId: number;
      quantity: number;
      subtotal: number;
      createdAt: string;
    }[] = [];

    for (const order of orders) {
      for (const item of order.items) {
        totalSales += Number(item.subtotal);
        productsSold += item.quantity;

        csvData.push({
          orderId: order.id,
          productId: item.product.id,
          quantity: item.quantity,
          subtotal: item.subtotal,
          createdAt: order.orderDate.toISOString(),
        });
      }
    }

    const filename = `sales_report_${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../../uploads/reports', filename);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'orderId', title: 'Order ID' },
        { id: 'productId', title: 'Product ID' },
        { id: 'quantity', title: 'Quantity' },
        { id: 'subtotal', title: 'Subtotal' },
        { id: 'createdAt', title: 'Created At' },
      ],
    });

    try {
      await csvWriter.writeRecords(csvData);
    } catch {
      throw new InternalServerErrorException('Erro ao gerar o arquivo CSV.');
    }

    // Cria o registro do relatório no banco
    const report = this.salesReportRepo.create({
      period: new Date(startDate),
      totalSales,
      productsSold,
      filePath,
    });

    return this.salesReportRepo.save(report);
  }

  async findAll(): Promise<SalesReportEntity[]> {
    return this.salesReportRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<SalesReportEntity> {
    const report = await this.salesReportRepo.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Relatório de vendas não encontrado.');
    }

    return report;
  }
}
