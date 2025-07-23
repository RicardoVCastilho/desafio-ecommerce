import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ProductEntity } from 'src/products/entities/product.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItemEntity> {
    const product = await this.productRepository.findOneBy({ id: createOrderItemDto.productId });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const orderItem = this.orderItemRepository.create({
      product,
      quantity: createOrderItemDto.quantity,
      unitPrice: createOrderItemDto.unitPrice,
    });

    return this.orderItemRepository.save(orderItem);
  }

  async findAll(): Promise<OrderItemEntity[]> {
    return this.orderItemRepository.find({ relations: ['product', 'order'] });
  }

  async findOne(id: number): Promise<OrderItemEntity> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['product', 'order'],
    });
    if (!orderItem) {
      throw new NotFoundException(`OrderItem #${id} não encontrado`);
    }
    return orderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItemEntity> {
    const orderItem = await this.findOne(id);

    if (updateOrderItemDto.productId) {
      const product = await this.productRepository.findOneBy({ id: updateOrderItemDto.productId });
      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }
      orderItem.product = product;
    }

    if (updateOrderItemDto.quantity !== undefined) {
      orderItem.quantity = updateOrderItemDto.quantity;
    }

    if (updateOrderItemDto.unitPrice !== undefined) {
      orderItem.unitPrice = updateOrderItemDto.unitPrice;
    }

    return this.orderItemRepository.save(orderItem);
  }

  async remove(id: number): Promise<void> {
    const orderItem = await this.findOne(id);
    await this.orderItemRepository.remove(orderItem);
  }
}
