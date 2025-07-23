import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemEntity } from './entities/order-item.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { UserRole } from 'src/utility/common/user-roles.enum';

@ApiTags('Itens do Pedido')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Post()
  @ApiOperation({ summary: 'Cria um novo item de pedido' })
  @ApiResponse({
    status: 201,
    description: 'Item de pedido criado com sucesso',
    type: OrderItemEntity,
  })
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('all')
  @ApiOperation({ summary: 'Retorna todos os itens de pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens retornada com sucesso',
    type: [OrderItemEntity],
  })
  findAll() {
    return this.orderItemsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('single/:id')
  @ApiOperation({ summary: 'Retorna um item de pedido pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Item encontrado com sucesso',
    type: OrderItemEntity,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async findOne(@Param('id') id: number) {
    return this.orderItemsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um item de pedido pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Item atualizado com sucesso',
    type: OrderItemEntity,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async update(@Param('id') id: number, @Body() updateOrderItemDto: UpdateOrderItemDto) {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um item de pedido pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Item removido com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Item removido com sucesso',
        timestamp: new Date().toISOString(),
        path: '/order-items/1',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async remove(@Param('id') id: number) {
    await this.orderItemsService.remove(id);
    return {
      statusCode: 200,
      message: 'Item removido com sucesso',
      timestamp: new Date().toISOString(),
      path: `/order-items/${id}`,
    };
  }
}
