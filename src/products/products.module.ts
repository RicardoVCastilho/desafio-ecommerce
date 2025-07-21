import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity, UserEntity])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
