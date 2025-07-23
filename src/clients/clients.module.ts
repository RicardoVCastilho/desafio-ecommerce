import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/clients.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity, UserEntity])],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService]
})
export class ClientsModule {}
