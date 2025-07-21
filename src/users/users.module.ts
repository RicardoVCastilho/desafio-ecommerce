import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MailService } from '../utility/services/mail.services';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], 
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService, MailService]
})
export class UsersModule {}
