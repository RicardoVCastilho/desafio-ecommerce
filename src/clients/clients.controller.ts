import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthenticationGuard } from '../utility/guards/authentication.guard';
import { AuthorizeGuard } from '../utility/guards/authorization.guard';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../utility/common/user-roles.enum';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Get('all')
  findAll() {
    // Só admin vê todos os clients
    return this.clientsService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserEntity,
  ) {
    const client = await this.clientsService.findOne(id);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    const isOwner = client.user.id === currentUser.id;

    if (isAdmin || isOwner) {
      return client;
    }

    throw new UnauthorizedException('Acesso negado.');
  }

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    // Somente admins podem criar clients para outros usuários
    if (!currentUser.role.includes(UserRole.ADMIN)) {
      throw new UnauthorizedException('Acesso negado.');
    }

    return this.clientsService.create(createClientDto);
  }

  @UseGuards(AuthenticationGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    const client = await this.clientsService.findOne(id);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    const isOwner = client.user.id === currentUser.id;

    if (isAdmin || isOwner) {
      return this.clientsService.update(id, updateClientDto);
    }

    throw new UnauthorizedException('Você só pode editar seu próprio cliente.');
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserEntity,
  ) {
    const client = await this.clientsService.findOne(id);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    const isOwner = client.user.id === currentUser.id;

    if (isAdmin || isOwner) {
      return this.clientsService.remove(id);
    }

    throw new UnauthorizedException('Você só pode deletar seu próprio cliente.');
  }
}
