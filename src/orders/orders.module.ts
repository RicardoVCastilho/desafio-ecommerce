import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from 'src/order-items/entities/order-item.entity';
import { ClientEntity } from 'src/clients/entities/clients.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ClientsModule } from 'src/clients/clients.module';  // importe aqui

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ClientEntity, ProductEntity]),
    ClientsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
