import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, UnauthorizedException, NotFoundException, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthenticationGuard } from '../utility/guards/authentication.guard';
import { AuthorizeGuard } from '../utility/guards/authorization.guard';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../utility/common/user-roles.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientResponseDto } from './dto/client-response.dto';

ApiTags('Clientes')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criação de um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso', type: ClientResponseDto })
  @ApiResponse({ status: 401, description: 'Acesso negado' })
  async create(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ClientResponseDto> {
    if (!currentUser.role.includes(UserRole.ADMIN)) {
      throw new UnauthorizedException('Acesso negado.');
    }

    return this.clientsService.create(createClientDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('all')
  @ApiOperation({ summary: 'Lista todos os clientes (somente admin)' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso', type: [ClientResponseDto] })
  @ApiResponse({ status: 401, description: 'Acesso negado' })
  async findAll(): Promise<ClientResponseDto[]> {
    return await this.clientsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('single/:id')
  @ApiOperation({ summary: 'Retorna um cliente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cliente retornado com sucesso', type: ClientResponseDto })
  @ApiResponse({ status: 401, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findOne(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ClientResponseDto> {
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

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza dados de um cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso', type: ClientResponseDto })
  @ApiResponse({ status: 401, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async update(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ClientResponseDto> {
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

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um cliente' })
  @ApiResponse({ status: 200, description: 'Cliente removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async remove(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<{ message: string }> {
    const client = await this.clientsService.findOne(id);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    const isOwner = client.user.id === currentUser.id;

    if (isAdmin || isOwner) {
      await this.clientsService.remove(id);
      return { message: 'Cliente removido com sucesso.' };
    }

    throw new UnauthorizedException('Você só pode deletar seu próprio cliente.');
  }
}
