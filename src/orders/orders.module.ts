import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from '../order-items/entities/order-item.entity';
import { ClientEntity } from '../clients/entities/clients.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ClientsModule } from '../clients/clients.module';  // importe aqui

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ClientEntity, ProductEntity]),
    ClientsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
