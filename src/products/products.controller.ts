import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from '../utility/guards/authentication.guard';
import { UserRole } from '../utility/common/user-roles.enum';
import { AuthorizeGuard } from '../utility/guards/authorization.guard';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Produtos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Post()
  @ApiOperation({ summary: 'Cria um novo produto (somente admin)' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    schema: {
      example: {
        statusCode: 201,
        message: 'Produto criado com sucesso',
        data: {
          id: 1,
          name: 'Smartphone XYZ',
          description: 'Smartphone com tela 6.5 polegadas',
          price: 1999.99,
          quantity: 10,
          images: ['img1.jpg', 'img2.jpg'],
          createdAt: '2025-07-23T16:00:00Z',
          updatedAt: '2025-07-23T16:00:00Z',
          category: {
            id: 1,
            title: 'Eletrônicos',
          },
          addedBy: {
            id: 1,
            name: 'Ricardo Vitor',
          },
        },
        timestamp: '2025-07-23T16:00:00Z',
        path: '/products',
      },
    },
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity,
    @Req() request: Request,
  ) {
    const product = await this.productsService.create(createProductDto, currentUser);

    return {
      statusCode: 201,
      message: 'Produto criado com sucesso',
      data: product,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('all')
  @ApiOperation({ summary: 'Retorna todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lista de produtos retornada com sucesso',
        data: [
          {
            id: 1,
            name: 'Smartphone XYZ',
            description: 'Smartphone com tela 6.5 polegadas',
            price: 1999.99,
            quantity: 10,
            images: ['img1.jpg', 'img2.jpg'],
            createdAt: '2025-07-23T16:00:00Z',
            updatedAt: '2025-07-23T16:00:00Z',
            category: {
              id: 1,
              title: 'Eletrônicos',
            },
            addedBy: {
              id: 1,
              name: 'Ricardo Vitor',
            },
          },
        ],
        timestamp: '2025-07-23T16:00:00Z',
        path: '/products/all',
      },
    },
  })
  async findAll(@Req() request: Request) {
    const products = await this.productsService.findAll();
    return {
      statusCode: 200,
      message: 'Lista de produtos retornada com sucesso',
      data: products,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('single/:id')
  @ApiOperation({ summary: 'Retorna um produto pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Produto encontrado com sucesso',
        data: {
          id: 1,
          name: 'Smartphone XYZ',
          description: 'Smartphone com tela 6.5 polegadas',
          price: 1999.99,
          quantity: 10,
          images: ['img1.jpg', 'img2.jpg'],
          createdAt: '2025-07-23T16:00:00Z',
          updatedAt: '2025-07-23T16:00:00Z',
          category: {
            id: 1,
            title: 'Eletrônicos',
          },
          addedBy: {
            id: 1,
            name: 'Ricardo Vitor',
          },
        },
        timestamp: '2025-07-23T16:00:00Z',
        path: '/products/single/1',
      },
    },
  })
  async findOne(@Param('id') id: string, @Req() request: Request) {
    const product = await this.productsService.findOne(+id);
    return {
      statusCode: 200,
      message: 'Produto encontrado com sucesso',
      data: product,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um produto pelo ID (somente admin)' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Produto atualizado com sucesso',
        data: {
          id: 1,
          name: 'Smartphone XYZ Atualizado',
          description: 'Descrição atualizada do produto',
          price: 1999.99,
          quantity: 15,
          images: ['img1.jpg', 'img3.jpg'],
          createdAt: '2025-07-23T16:00:00Z',
          updatedAt: '2025-07-23T17:00:00Z',
          category: {
            id: 1,
            title: 'Eletrônicos',
          },
          addedBy: {
            id: 1,
            name: 'Ricardo Vitor',
          },
        },
        timestamp: '2025-07-23T17:00:00Z',
        path: '/products/1',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() currentUser: UserEntity,
    @Req() request: Request,
  ) {
    const updatedProduct = await this.productsService.update(+id, updateProductDto, currentUser);
    return {
      statusCode: 200,
      message: 'Produto atualizado com sucesso',
      data: updatedProduct,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um produto pelo ID (somente admin)' })
  @ApiResponse({
    status: 204,
    description: 'Produto removido com sucesso (sem conteúdo no body)',
  })
  async remove(@Param('id') id: string, @Req() request: Request) {
    await this.productsService.remove(+id);
    return {
      statusCode: 204,
      message: 'Produto removido com sucesso',
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }
}
