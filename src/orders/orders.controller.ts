import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderEntity } from './entities/order.entity';
import { AuthenticationGuard } from '../utility/guards/authentication.guard';
import { AuthorizeGuard } from '../utility/guards/authorization.guard';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../utility/common/user-roles.enum';
import { ClientsService } from '../clients/clients.service';

@ApiTags('Pedidos')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly clientsService: ClientsService,
  ) { }


  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso.',
    schema: {
      example: {
        statusCode: 201,
        message: 'Pedido criado com sucesso.',
        data: {
          id: 1,
          client: {
            id: 1,
            fullName: 'Luana Castilho',
            contact: '81 999999999',
            address: 'Rua das Flores, 123',
            isActive: true,
            user: {
              id: 1,
              name: 'Luana Castilho',
              email: 'aluana@example.com',
            },
            createdAt: '2025-07-21T18:09:55.609Z',
            updatedAt: '2025-07-21T18:09:55.609Z',
          },
          status: 'Recebido',
          orderDate: '2025-07-22T23:45:44.409Z',
          total: '950.00',
          items: [
            {
              id: 1,
              product: {
                id: 2,
                name: 'Título 1 updated',
                description: 'Desc do produto 1',
                price: '250.50',
                quantity: 4,
                images: ['path1', 'path2'],
                createdAt: '2025-07-21T19:57:14.662Z',
                updatedAt: '2025-07-23T17:57:25.315Z',
              },
              quantity: 2,
              unitPrice: '250.00',
              subtotal: '500.00',
            },
            {
              id: 2,
              product: {
                id: 3,
                name: 'Nome do Produto Exemplo',
                description: 'Descrição detalhada do produto',
                price: '150.00',
                quantity: 0,
                images: ['imagem1.jpg', 'imagem2.jpg'],
                createdAt: '2025-07-22T23:43:14.943Z',
                updatedAt: '2025-07-23T17:57:25.315Z',
              },
              quantity: 3,
              unitPrice: '150.00',
              subtotal: '450.00',
            },
          ],
        },
        timestamp: new Date().toISOString(),
        path: '/orders',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado para o usuário.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    if (currentUser.role.includes(UserRole.ADMIN)) {
      return this.ordersService.create(createOrderDto);
    } else {
      const client = await this.clientsService.findByUserId(currentUser.id);
      if (!client) {
        throw new NotFoundException('Cliente não encontrado para este usuário');
      }
      const orderData = { ...createOrderDto, clientId: client.id };
      return this.ordersService.create(orderData);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post(':id/pay')
  @ApiOperation({ summary: 'Simula o pagamento de um pedido e atualiza seu status' })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com o status do pagamento',
    schema: {
      example: {
        statusCode: 200,
        message: 'Pagamento processado com sucesso',
        data: {
          id: 1,
          client: {
            id: 1,
            fullName: 'Luana Castilho',
            contact: '81 999999999',
            address: 'Rua das Flores, 123',
            isActive: true,
            user: {
              id: 1,
              name: 'Luana Castilho',
              email: 'aluana@example.com',
            },
            createdAt: '2025-07-21T18:09:55.609Z',
            updatedAt: '2025-07-21T18:09:55.609Z',
          },
          status: 'Pago',
          orderDate: '2025-07-22T23:45:44.409Z',
          total: '950.00',
          items: [
            {
              id: 1,
              product: {
                id: 2,
                name: 'Título 1 updated',
                description: 'Desc do produto 1',
                price: '250.50',
                quantity: 4,
                images: ['path1', 'path2'],
                createdAt: '2025-07-21T19:57:14.662Z',
                updatedAt: '2025-07-23T17:57:25.315Z',
              },
              quantity: 2,
              unitPrice: '250.00',
              subtotal: '500.00',
            },
            {
              id: 2,
              product: {
                id: 3,
                name: 'Nome do Produto Exemplo',
                description: 'Descrição detalhada do produto',
                price: '150.00',
                quantity: 0,
                images: ['imagem1.jpg', 'imagem2.jpg'],
                createdAt: '2025-07-22T23:43:14.943Z',
                updatedAt: '2025-07-23T17:57:25.315Z',
              },
              quantity: 3,
              unitPrice: '150.00',
              subtotal: '450.00',
            },
          ],
        },
        timestamp: new Date().toISOString(),
        path: '/orders/{id}/pay',

      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async payOrder(
    @Param('id') id: number,
    @Body('success') success: boolean,
  ) {
    return this.ordersService.processPayment(id, success);
  }

  @ApiOperation({ summary: 'Retorna todos os pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lista de pedidos retornada com sucesso',
        data: [
          {
            id: 1,
            client: {
              id: 1,
              fullName: 'João Silva',
              contact: '81 99999-9999',
              address: 'Rua A, 123',
              isActive: true,
            },
            status: 'Pago',
            orderDate: '2025-07-23T12:00:00Z',
            total: '500.00',
            items: [
              {
                id: 1,
                product: {
                  id: 2,
                  name: 'Produto Exemplo',
                  price: '250.00',
                },
                quantity: 2,
                unitPrice: '250.00',
                subtotal: '500.00',
              },
            ],
          },
        ],
        timestamp: new Date().toISOString(),
        path: '/orders',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna um pedido pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Pedido encontrado com sucesso',
        data: {
          id: 1,
          client: {
            id: 1,
            fullName: 'João Silva',
            contact: '81 99999-9999',
            address: 'Rua A, 123',
            isActive: true,
          },
          status: 'Pago',
          orderDate: '2025-07-23T12:00:00Z',
          total: '500.00',
          items: [
            {
              id: 1,
              product: {
                id: 2,
                name: 'Produto Exemplo',
                price: '250.00',
              },
              quantity: 2,
              unitPrice: '250.00',
              subtotal: '500.00',
            },
          ],
        },
        timestamp: new Date().toISOString(),
        path: '/orders/1',
      },
    },
  })

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um pedido pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Pedido atualizado com sucesso',
        data: {
          id: 1,
          client: {
            id: 1,
            fullName: 'João Silva',
            contact: '81 99999-9999',
            address: 'Rua A, 123',
            isActive: true,
          },
          status: 'Em preparação',
          orderDate: '2025-07-23T12:00:00Z',
          total: '500.00',
          items: [
            {
              id: 1,
              product: {
                id: 2,
                name: 'Produto Exemplo',
                price: '250.00',
              },
              quantity: 2,
              unitPrice: '250.00',
              subtotal: '500.00',
            },
          ],
        },
        timestamp: new Date().toISOString(),
        path: '/orders/1',
      },
    },
  })

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um pedido pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Pedido removido com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Pedido removido com sucesso',
        timestamp: new Date().toISOString(),
        path: '/orders/1',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(+id);
    return {
      statusCode: 200,
      message: 'Pedido removido com sucesso',
      timestamp: new Date().toISOString(),
      path: `/orders/${id}`,
    };
  }

}
