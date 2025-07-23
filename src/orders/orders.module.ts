import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from 'src/order-items/entities/order-item.entity';
import { ClientEntity } from 'src/clients/entities/clients.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ClientEntity, ProductEntity])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
