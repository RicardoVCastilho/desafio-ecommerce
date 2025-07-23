import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItemEntity } from './entities/order-item.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { OrderEntity } from '../orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemEntity, ProductEntity, OrderEntity])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService], 
})
export class OrderItemsModule {}
