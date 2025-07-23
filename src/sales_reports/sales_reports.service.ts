import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual, FindOptionsWhere } from 'typeorm';
import { SalesReportEntity } from './entities/sales_report.entity';
import { CreateSalesReportDto } from './dto/create-sales_report.dto';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderItemEntity } from '../order-items/entities/order-item.entity';
import { OrderStatus } from '../utility/common/order-status.enum';
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
  ) { }

  async create(createSalesReportDto: CreateSalesReportDto): Promise<SalesReportEntity> {
    const { startDate, endDate, clientId, productId, status } = createSalesReportDto;

    // Monta o filtro dinâmico para a query de pedidos
    const whereConditions: FindOptionsWhere<OrderEntity> = {};

    if (startDate && endDate) {
      whereConditions.orderDate = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      whereConditions.orderDate = MoreThanOrEqual(new Date(startDate));
    } else if (endDate) {
      whereConditions.orderDate = LessThanOrEqual(new Date(endDate));
    }

    if (clientId) {
      whereConditions.client = { id: clientId };
    }

    if (status) {
      whereConditions.status = status;
    }

    // Busca pedidos com filtros, incluindo itens e produtos relacionados
    const orders = await this.orderRepo.find({
      where: whereConditions,
      relations: ['items', 'items.product', 'client'],
    });

    if (!orders.length) {
      throw new NotFoundException('Nenhuma venda encontrada com os filtros informados.');
    }

    let totalSales = 0;
    let productsSold = 0;

    // Aplica filtro de produto nos itens, se necessário
    const filteredOrders = productId
      ? orders.map(order => ({
        ...order,
        items: order.items.filter(item => item.product.id === productId),
      })).filter(order => order.items.length > 0)
      : orders;

    if (!filteredOrders.length) {
      throw new NotFoundException('Nenhum item de venda encontrado para o produto informado.');
    }

    const csvData: {
      orderId: number;
      productId: number;
      quantity: number;
      subtotal: number;
      createdAt: string;
    }[] = [];

    for (const order of filteredOrders) {
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

    // Use o período do filtro (startDate) para o campo period, ou a data atual se não informado
    const reportPeriod = startDate ? new Date(startDate) : new Date();

    const report = this.salesReportRepo.create({
      period: reportPeriod,
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
