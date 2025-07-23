import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from 'src/order-items/entities/order-item.entity';
import { ClientEntity } from 'src/clients/entities/clients.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from 'src/utility/common/order-status.enum';
import { DataSource } from 'typeorm';



@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,

    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    private readonly dataSource: DataSource,
  ) {}

async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const client = await queryRunner.manager.findOne(ClientEntity, {
      where: { id: createOrderDto.clientId }
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    const productIds = createOrderDto.items.map(item => item.productId);
    const products = await queryRunner.manager.findBy(ProductEntity, {
      id: In(productIds)
    });

    for (const item of createOrderDto.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new NotFoundException(`Produto ID ${item.productId} não encontrado`);

      if (product.quantity < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para o produto ${product.name}`);
      }

      product.quantity -= item.quantity;
      await queryRunner.manager.save(ProductEntity, product);
    }

    const order = queryRunner.manager.create(OrderEntity, {
      client,
      status: createOrderDto.status ?? OrderStatus.RECEIVED,
      total: createOrderDto.total,
    });

    const savedOrder = await queryRunner.manager.save(OrderEntity, order);

    const orderItems = createOrderDto.items.map(item =>
      queryRunner.manager.create(OrderItemEntity, {
        product: products.find(p => p.id === item.productId),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        order: savedOrder,
      }),
    );

    await queryRunner.manager.save(OrderItemEntity, orderItems);

    await queryRunner.commitTransaction();
    return savedOrder;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      relations: ['items', 'client'],
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'client', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Pedido #${id} não encontrado`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pedido #${id} não encontrado`);
    }
  }

  async processPayment(orderId: number, paymentSuccess: boolean): Promise<OrderEntity> {
  const order = await this.findOne(orderId);
  if (!order) throw new NotFoundException(`Pedido #${orderId} não encontrado`);

  if (paymentSuccess) {
    order.status = OrderStatus.PAID;
  } else {
    order.status = OrderStatus.PAYMENT_FAILED;
  }

  return this.orderRepository.save(order);
}

}
